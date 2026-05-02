import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from './config';

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-30.acacia'
});
