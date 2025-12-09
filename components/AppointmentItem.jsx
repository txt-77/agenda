import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function AppointmentItem({ item, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text>{item.date} {item.time}</Text>
        {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit} style={styles.btn}><Text>Editar</Text></TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={[styles.btn, { marginTop: 8 }]}><Text style={{color:'red'}}>Remover</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, backgroundColor: '#fff', borderRadius: 8, marginBottom: 10, flexDirection: 'row', alignItems: 'center', elevation: 1 },
  title: { fontWeight: 'bold', marginBottom: 4 },
  desc: { color: '#555', marginTop: 6 },
  actions: { marginLeft: 12 },
  btn: { padding: 6, borderRadius: 6, backgroundColor: '#eee' }
});
