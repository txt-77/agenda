import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { saveToken } from '../services/auth';

const schema = z.object({
  username: z.string().min(1, 'Usuário é obrigatório'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
});

export default function LoginScreen({ navigation }) {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      // Exemplo: salvar token fictício
      await saveToken('token_exemplo_123');
      Alert.alert('Login', 'Login efetuado com sucesso (exemplo)');
      navigation.replace('Appointments');
    } catch (err) {
      Alert.alert('Erro', 'Falha no login: ' + String(err));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>

      <Controller
        control={control}
        name="username"
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <TextInput placeholder="Usuário" value={value} onChangeText={onChange} style={styles.input} />
        )}
      />
      {errors.username && <Text style={styles.error}>{String(errors.username.message)}</Text>}

      <Controller
        control={control}
        name="password"
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <TextInput placeholder="Senha" secureTextEntry value={value} onChangeText={onChange} style={styles.input} />
        )}
      />
      {errors.password && <Text style={styles.error}>{String(errors.password.message)}</Text>}

      <Button title={isSubmitting ? 'Entrando...' : 'Entrar'} onPress={handleSubmit(onSubmit)} disabled={isSubmitting} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8, borderRadius: 6 },
  error: { color: 'red', marginBottom: 8 }
});
