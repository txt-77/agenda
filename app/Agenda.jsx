import React, { useCallback, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext.jsx';
import AppointmentItem from '../components/AppointmentItem.jsx';
import { useFocusEffect, useRouter } from 'expo-router';
import { useThemeColor } from '../hooks/useThemeColor';

export default function Agenda() {
  const { colors } = useThemeColor();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const storageKey = user ? `@appointments_${user.username}` : null;

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const json = await AsyncStorage.getItem(storageKey);
      const arr = json ? JSON.parse(json) : [];
      arr.sort((a,b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
      setAppointments(arr);
    } catch (e) {
      console.warn(e);
      Alert.alert('Erro', 'Falha ao carregar compromissos');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [user])
  );

  const onDelete = (id) => {
    Alert.alert('Confirmar', 'Deseja remover este compromisso?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: async () => {
          try {
            const filtered = appointments.filter(a => a.id !== id);
            setAppointments(filtered);
            await AsyncStorage.setItem(storageKey, JSON.stringify(filtered));
          } catch (e) {
            Alert.alert('Erro', 'Não foi possível remover');
          }
      } }
    ]);
  };

  const filtered = appointments.filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Agenda — {user?.username}</Text>
        <Button title="Sair" onPress={logout} />
      </View>

      <View style={{ padding: 12, flex: 1 }}>
        <TextInput
          placeholder="Buscar por título..."
          placeholderTextColor={colors.border}
          value={query}
          onChangeText={setQuery}
          style={[styles.search, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
        />

        <Button title="Adicionar compromisso" onPress={() => router.push('/AddEditAppointment?mode=add')} />
        <View style={{ height: 12 }} />

        {loading ? <Text style={{ color: colors.text }}>Carregando...</Text> :
          filtered.length === 0 ? <Text style={{ color: colors.text, marginTop: 12 }}>Nenhum compromisso</Text> :
          <FlatList
            data={filtered}
            keyExtractor={i => i.id}
            renderItem={({item}) => (
              <AppointmentItem item={item}
                onEdit={() => router.push({ pathname: '/AddEditAppointment', params: { mode: 'edit', item: JSON.stringify(item) } })}
                onDelete={() => onDelete(item.id)}
              />
            )}
          />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontSize: 18, fontWeight: 'bold' },
  search: { borderWidth: 1, padding: 8, borderRadius: 6, marginBottom: 12 }
});
