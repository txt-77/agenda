import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Index() {
  const { user } = useAuth();
  return user ? <Redirect href="/Agenda" /> : <Redirect href="/Login" />;
}
