import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useThemeColor } from '../hooks/useThemeColor';
import { useRouter } from 'expo-router';

export default function Login() {
  const { colors } = useThemeColor();
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async () => {
    if (!username || !password) return Alert.alert('Erro', 'Preencha usuário e senha');
    setBusy(true);
    try {
      await login(username.trim(), password);
      // router.replace('/agenda') handled in AuthContext
    } catch (e) {
      Alert.alert('Falha', e.message || 'Erro ao logar');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Entrar</Text>

      <TextInput
        placeholder="Usuário"
        placeholderTextColor={colors.border}
        value={username}
        onChangeText={setUsername}
        style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor={colors.border}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
      />

      {busy ? (
        <ActivityIndicator style={{ marginTop: 12 }} />
      ) : (
        <>
          <Button title="Entrar" onPress={onSubmit} />
          <View style={{ height: 12 }} />
          <Button title="Criar conta" onPress={() => router.push('/register')} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  input: { borderWidth: 1, padding: 10, borderRadius: 6, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }
});
