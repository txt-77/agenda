import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { scheduleReminder } from '../notifications/setup';

export default function AddEditAppointment() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const mode = params.mode;
  const appointment = params.item ? JSON.parse(params.item) : null;

  const { user } = useAuth();

  const [title, setTitle] = useState(appointment?.title || '');
  const [description, setDescription] = useState(appointment?.description || '');
  const [date, setDate] = useState(appointment?.date || '');
  const [time, setTime] = useState(appointment?.time || '');
  const [busy, setBusy] = useState(false);

  const storageKey = `@appointments_${user.username}`;

  const validate = () => {
    if (!title || !date || !time) {
      Alert.alert('Erro', 'Preencha título, data e hora');
      return false;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      Alert.alert('Erro', 'Data deve ter formato YYYY-MM-DD');
      return false;
    }
    if (!/^\d{2}:\d{2}$/.test(time)) {
      Alert.alert('Erro', 'Hora deve ter formato HH:MM');
      return false;
    }
    return true;
  };

  const onSave = async () => {
    if (!validate()) return;

    setBusy(true);

    try {
      const json = await AsyncStorage.getItem(storageKey);
      const arr = json ? JSON.parse(json) : [];

      if (mode === 'edit') {
        const updated = arr.map(a =>
          a.id === appointment.id
            ? { ...a, title, description, date, time }
            : a
        );
        await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
      } else {
        const newItem = {
          id: Date.now().toString(),
          title,
          description,
          date,
          time,
          createdAt: new Date().toISOString(),
        };
        arr.push(newItem);
        await AsyncStorage.setItem(storageKey, JSON.stringify(arr));
      }

      // schedule notification if date/time in future
      try {
        await scheduleReminder(date, time, title);
      } catch (e) {
        console.warn('Não foi possível agendar lembrete', e);
      }

      router.back();
    } catch (e) {
      console.log('ERRO AO SALVAR:', e);
      Alert.alert('Erro', e?.message || JSON.stringify(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título *</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Reunião, Consulta..." />
      <Text style={styles.label}>Descrição</Text>
      <TextInput style={[styles.input,{height:80}]} multiline value={description} onChangeText={setDescription} placeholder="Detalhes..." />
      <Text style={styles.label}>Data (YYYY-MM-DD) *</Text>
      <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="2025-12-31" />
      <Text style={styles.label}>Hora (HH:MM) *</Text>
      <TextInput style={styles.input} value={time} onChangeText={setTime} placeholder="13:30" />
      <Button title={busy ? 'Salvando...' : 'Salvar'} onPress={onSave} disabled={busy} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex:1,padding:16},
  input: {borderWidth:1,borderColor:'#ccc',padding:10,borderRadius:6,marginBottom:12},
  label: {fontWeight:'600',marginBottom:6}
});
