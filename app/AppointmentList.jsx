import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';

type Appointment = {
  id: string;
  title: string;
  startAt: string;
  description?: string;
};

const sampleData: Appointment[] = [
  { id: '1', title: 'Consulta', startAt: new Date().toISOString(), description: 'Consulta médica' },
  { id: '2', title: 'Reunião', startAt: new Date(Date.now()+3600*1000).toISOString(), description: 'Reunião com equipe' },
];

export default function AppointmentList({ navigation }: any) {
  const onEdit = (item: Appointment) => {
    Alert.alert('Editar', `Editar evento: ${item.title}`);
  };

  const onDelete = (item: Appointment) => {
    Alert.alert('Confirmar', `Remover evento ${item.title}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => {} }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Meus Compromissos</Text>
      <FlatList
        data={sampleData.sort((a,b)=> new Date(a.startAt).getTime() - new Date(b.startAt).getTime())}
        keyExtractor={item=>item.id}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View style={{flex:1}}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.time}>{new Date(item.startAt).toLocaleString()}</Text>
              {item.description && <Text>{item.description}</Text>}
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={()=>onEdit(item)}><Text style={styles.actionText}>Editar</Text></TouchableOpacity>
              <TouchableOpacity onPress={()=>onDelete(item)}><Text style={[styles.actionText, {color:'red'}]}>Excluir</Text></TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, marginBottom: 12 },
  card: { flexDirection: 'row', padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#eee', borderRadius: 8 },
  title: { fontSize: 16, fontWeight: '600' },
  time: { color: '#555' },
  actions: { justifyContent: 'center', alignItems: 'flex-end' },
  actionText: { marginBottom: 6 }
});
