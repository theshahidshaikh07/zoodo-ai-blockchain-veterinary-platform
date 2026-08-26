import { redirect } from 'next/navigation';

export default function LegacyVetRegister() {
  redirect('/register/business');
}