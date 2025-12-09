import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useThemeColor } from '../hooks/useThemeColor';
import { useRouter } from 'expo-router';

export default function Register() {
  const { colors } = useThemeColor();
  const router = useRouter();
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async () => {
    if (!username || !password || !confirm) return Alert.alert('Erro', 'Preencha todos os campos');
    if (password !== confirm) return Alert.alert('Erro', 'Senhas não conferem');
    setBusy(true);
    try {
      await register(username.trim(), password);
    } catch (e) {
      Alert.alert('Falha', e.message || 'Erro ao registrar');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Criar Conta</Text>

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

      <TextInput
        placeholder="Confirmar Senha"
        placeholderTextColor={colors.border}
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
      />

      {busy ? (
        <ActivityIndicator />
      ) : (
        <>
          <Button title="Criar conta" onPress={onSubmit} />
          <View style={{ height: 12 }} />
          <Button title="Voltar ao Login" onPress={() => router.push('/login')} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  input: { borderWidth: 1, padding: 10, borderRadius: 6, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }
});
