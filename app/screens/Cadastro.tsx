import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList, TabParamList, useTheme, useViagens } from '../types/navigations';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Cadastro'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function Cadastro({ navigation }: Props) {
  const { paises, adicionarViagem } = useViagens();
  const { isDarkMode } = useTheme();
  const [paisId, setPaisId] = useState(paises[0]?.id || '');
  const [local, setLocal] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [imagemUri, setImagemUri] = useState<string | null>(null);
  const [paisModalVisible, setPaisModalVisible] = useState(false);
  const [buscaPais, setBuscaPais] = useState('');

  const paisSelecionado = paises.find((pais) => pais.id === paisId);
  const paisesFiltrados = paises.filter((pais) =>
    pais.nome.toLowerCase().includes(buscaPais.trim().toLowerCase())
  );

  const selecionarFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setImagemUri(result.assets[0].uri);
    }
  };

  const salvarViagem = () => {
    if (!paisId || !local.trim() || !descricao.trim() || !data.trim() || !imagemUri) {
      Alert.alert('Preencha os campos', 'Escolha o país, informe os dados e selecione uma foto.');
      return;
    }

    adicionarViagem(paisId, {
      id: Date.now().toString(),
      local: local.trim(),
      descricao: descricao.trim(),
      data: data.trim(),
      imagemUri,
    });
    const pais = paises.find(item => item.id === paisId);
    Alert.alert('Memória salva!', `Sua foto foi adicionada à galeria de ${pais?.nome}.`);
    setLocal('');
    setDescricao('');
    setData('');
    setImagemUri(null);
  };

  const campos = [
    { label: 'Nome do local', value: local, onChangeText: setLocal, placeholder: 'Ex.: Torre Eiffel' },
    { label: 'Descrição da viagem', value: descricao, onChangeText: setDescricao, placeholder: 'Conte um pouco sobre esse momento', multiline: true },
    { label: 'Data da viagem', value: data, onChangeText: setData, placeholder: 'Ex.: 25/06/2025' },
  ];

  return (
    <KeyboardAvoidingView
      style={[styles.root, isDarkMode && styles.darkRoot]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>NOVA MEMÓRIA</Text>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>Registre uma viagem</Text>
        <Text style={[styles.subtitle, isDarkMode && styles.darkSecondaryText]}>
          Guarde uma foto especial e os detalhes do lugar que você visitou.
        </Text>

        <View style={[styles.form, isDarkMode && styles.darkCard]}>
          <Text style={[styles.label, isDarkMode && styles.darkText]}>País da foto</Text>
          <TouchableOpacity
            style={[styles.countrySelector, isDarkMode && styles.darkInput]}
            onPress={() => setPaisModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.countryEmoji}>{paisSelecionado?.emoji}</Text>
            <Text style={[styles.countrySelectedName, isDarkMode && styles.darkText]}>
              {paisSelecionado?.nome || 'Selecione um país'}
            </Text>
            <Text style={[styles.countryChevron, isDarkMode && styles.darkSecondaryText]}>⌄</Text>
          </TouchableOpacity>
          {campos.map((campo) => <Field key={campo.label} darkMode={isDarkMode} {...campo} />)}
          <TouchableOpacity style={styles.photoButton} onPress={selecionarFoto}>
            <Text style={styles.photoButtonText}>{imagemUri ? 'Foto selecionada ✓' : 'Fotos da minha viagem 📷'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={salvarViagem} activeOpacity={0.85}>
          <Text style={styles.submitText}>Salvar memória</Text>
          <Text style={styles.submitArrow}>→</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={paisModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPaisModalVisible(false)}
      >
        <View style={styles.dialogOverlay}>
          <View style={[styles.countryDialog, isDarkMode && styles.darkCard]}>
            <View style={styles.dialogHeader}>
              <View>
                <Text style={[styles.dialogTitle, isDarkMode && styles.darkText]}>Escolha o país</Text>
                <Text style={[styles.dialogSubtitle, isDarkMode && styles.darkSecondaryText]}>Onde essa memória aconteceu?</Text>
              </View>
              <TouchableOpacity onPress={() => setPaisModalVisible(false)} style={styles.dialogClose}>
                <Text style={styles.dialogCloseText}>×</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.countrySearch, isDarkMode && styles.darkInput]}
              value={buscaPais}
              onChangeText={setBuscaPais}
              placeholder="Buscar país"
              placeholderTextColor="#A99486"
              autoFocus
            />

            <FlatList
              data={paisesFiltrados}
              keyExtractor={(pais) => pais.id}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={<Text style={[styles.emptyText, isDarkMode && styles.darkSecondaryText]}>Nenhum país encontrado.</Text>}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.countryOption, paisId === item.id && styles.countryOptionSelected]}
                  onPress={() => {
                    setPaisId(item.id);
                    setPaisModalVisible(false);
                    setBuscaPais('');
                  }}
                >
                  <Text style={styles.countryEmoji}>{item.emoji}</Text>
                  <Text style={[styles.countryName, isDarkMode && styles.darkText]}>{item.nome}</Text>
                  {paisId === item.id && <Text style={styles.selectedCheck}>✓</Text>}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType,
  darkMode,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric';
  darkMode: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, darkMode && styles.darkText]}>{label}</Text>
      <TextInput
        style={[styles.input, darkMode && styles.darkInput, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A99486"
        multiline={multiline}
        keyboardType={keyboardType}
        maxLength={multiline ? 180 : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#ecf3ea' },
  darkRoot: { backgroundColor: '#0F172A' },
  darkText: { color: '#F8FAFC' },
  darkSecondaryText: { color: '#CBD5E1' },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  eyebrow: { color: '#439245', fontSize: 12, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: '#3D2314', fontSize: 30, fontWeight: '800', marginTop: 6 },
  subtitle: { color: '#6E6E6E', fontSize: 15, lineHeight: 22, marginTop: 8, marginBottom: 24 },
  form: { backgroundColor: '#FFF', borderRadius: 22, padding: 18, elevation: 3 },
  darkCard: { backgroundColor: '#1E293B' },
  countrySelector: { height: 52, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5DCD4', borderRadius: 12, paddingHorizontal: 14, marginBottom: 18, backgroundColor: '#FFFCF9' },
  countrySelectedName: { flex: 1, color: '#3D2314', fontSize: 15, fontWeight: '600' },
  countryChevron: { color: '#6E6E6E', fontSize: 24, lineHeight: 24 },
  countryEmoji: { fontSize: 18, marginRight: 5 },
  countryName: { color: '#3D2314', fontSize: 13, fontWeight: '600' },
  countryOption: { minHeight: 54, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F0E8E1', paddingHorizontal: 8 },
  countryOptionSelected: { backgroundColor: '#DDF3E4', borderRadius: 10 },
  selectedCheck: { marginLeft: 'auto', color: '#439245', fontSize: 20, fontWeight: '800' },
  dialogOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.55)' },
  countryDialog: { maxHeight: '78%', backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  dialogHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  dialogTitle: { color: '#3D2314', fontSize: 22, fontWeight: '800' },
  dialogSubtitle: { color: '#6E6E6E', fontSize: 13, marginTop: 4 },
  dialogClose: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#F1EAE4', alignItems: 'center', justifyContent: 'center' },
  dialogCloseText: { color: '#3D2314', fontSize: 24, lineHeight: 25 },
  countrySearch: { height: 48, borderWidth: 1, borderColor: '#E5DCD4', borderRadius: 12, color: '#3D2314', paddingHorizontal: 14, fontSize: 15, backgroundColor: '#FFFCF9', marginBottom: 12 },
  emptyText: { textAlign: 'center', paddingVertical: 24, color: '#6E6E6E' },
  field: { marginBottom: 16 },
  label: { color: '#3D2314', fontSize: 13, fontWeight: '700', marginBottom: 7 },
  input: { height: 48, borderWidth: 1, borderColor: '#E5DCD4', borderRadius: 12, color: '#3D2314', paddingHorizontal: 14, fontSize: 15, backgroundColor: '#FFFCF9' },
  darkInput: { borderColor: '#475569', color: '#F8FAFC', backgroundColor: '#0F172A' },
  multilineInput: { height: 82, paddingTop: 13, textAlignVertical: 'top' },
  photoButton: { backgroundColor: '#475569', borderRadius: 12, padding: 13, alignItems: 'center', marginTop: 2 },
  photoButtonText: { color: '#FFF', fontWeight: '700' },
  submitButton: { backgroundColor: '#3D2314', borderRadius: 15, height: 54, marginTop: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  submitArrow: { color: '#FFF', fontSize: 24, fontWeight: '700' },
});
