import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Injectable()
export class AuthService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async authenticateWithOTP(idToken: string) {
    try {
      const decodedToken = await this.firebaseService.verifyToken(idToken);
      // Here you would check if the user exists in MongoDB.
      // If not, create a new user profile using the phone number.
      
      // Return a custom JWT or session token for the NestJS API
      return {
        accessToken: 'mock-jwt-token-based-on-uid',
        user: {
          uid: decodedToken.uid,
          phone: decodedToken.phone_number,
          role: 'CUSTOMER',
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid Firebase Token');
    }
  }
}
