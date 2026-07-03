import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients = new Map<string, string>();

  constructor(private readonly prisma: PrismaService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, 'User');
    this.server.emit('online_users', this.connectedClients.size);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
    this.server.emit('online_users', this.connectedClients.size);
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() payload: { sender: string; text: string; room: string },
    @ConnectedSocket() client: Socket,
  ) {
    const saved = await this.prisma.chatMessage.create({
      data: {
        sender: payload.sender,
        text: payload.text,
        room: payload.room || 'support_room',
      }
    });

    this.server.to(payload.room).emit('receive_message', {
      id: saved.id,
      sender: saved.sender,
      text: saved.text,
      createdAt: saved.createdAt,
    });
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(room);
    console.log(`Client ${client.id} joined room ${room}`);

    const history = await this.prisma.chatMessage.findMany({
      where: { room },
      orderBy: { createdAt: 'asc' },
      take: 50,
    });
    client.emit('chat_history', history);
  }

  // Called by OrdersService to push an invoice receipt to all users
  broadcastInvoice(invoiceData: Record<string, any>) {
    console.log(`[ChatGateway] Broadcasting invoice INV-${invoiceData.shortId} to all clients`);
    this.server.emit('invoice_received', invoiceData);
  }
}
