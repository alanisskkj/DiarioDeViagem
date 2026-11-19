import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Switch,
  Animated,
  StatusBar,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pais, TabParamList, RootStackParamList, useViagens, useTheme } from '../types/navigations';
import { Accelerometer } from 'expo-sensors';
import NetInfo from '@react-native-community/netinfo';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Explorar'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function Home({ route, navigation }: Props) {
  const usuario = route.params?.usuario || 'Visitante';
  const { paises } = useViagens();
  const { isDarkMode, toggleTheme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [buscaPais, setBuscaPais] = useState('');

  const paisesFiltrados = paises.filter((pais) =>
    pais.nome.toLowerCase().includes(buscaPais.trim().toLowerCase())
  );

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected && state.isInternetReachable !== false);
    });

    return unsubscribe;
  }, []);

  // 🔄 REQUISITO 2: Shake to Refresh no Dashboard
  useEffect(() => {
    if (Platform.OS === 'web') return;

    Accelerometer.setUpdateInterval(100);

    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const totalForce = Math.abs(x) + Math.abs(y) + Math.abs(z);
      if (totalForce > 3.5) {
        // Alerta que simula sincronização com o servidor
        Alert.alert(
          '🔄 Sincronizando...',
          'Buscando por novas doações e causas sociais no servidor!'
        );
      }
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderPaisItem = ({ item }: { item: Pais }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: item.cor }]}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('OngDetalhes', {
          paisId: item.id,
          nomePais: item.nome,
        })
      }
    >
      <View style={styles.cardEmoji}>
        <Text style={styles.emojiText}>{item.emoji}</Text>
      </View>

      <View style={styles.cardInfo}>
        <Text style={[styles.ongNome, isDarkMode && styles.darkText]}>{item.nome}</Text>
        <Text style={[styles.ongDetails, isDarkMode && styles.darkSecondaryText]}>
          {item.fotos.length} {item.fotos.length === 1 ? 'memória registrada' : 'memórias registradas'}
        </Text>
        <Text style={[styles.ongCity, isDarkMode && styles.darkSecondaryText]}>📷 Toque para explorar</Text>
      </View>

      <View style={styles.arrowBtn}>
        <Text style={[styles.arrowText, isDarkMode && styles.darkArrowText]}>→</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <FlatList
          data={paisesFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={renderPaisItem}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.header}>
              <View style={styles.headerRow}>
                <View style={styles.headerText}>
                  <Text style={[styles.welcome, isDarkMode && styles.darkText]}>Olá, {usuario}! 👋</Text>
                  <Text style={[styles.title, isDarkMode && styles.darkText]}>
                Guarde suas melhores memórias pelo mundo
                  </Text>
                </View>
                <View style={styles.themeToggle}>
                  <Text style={[styles.themeLabel, isDarkMode && styles.darkText]}>{isDarkMode ? 'Dark' : 'Light'}</Text>
                  <Switch value={isDarkMode} onValueChange={toggleTheme} />
                </View>
              </View>
              <View style={styles.networkStatus}>
                <View
                  style={[
                    styles.networkDot,
                    isConnected === true
                      ? styles.networkOnline
                      : isConnected === false
                        ? styles.networkOffline
                        : styles.networkChecking,
                  ]}
                />
                <Text style={[styles.networkText, isDarkMode && styles.darkSecondaryText]}>
                  {isConnected === null
                    ? 'Verificando conexão...'
                    : isConnected
                      ? 'Online'
                      : 'Offline'}
                </Text>
              </View>
              <Text style={styles.hintText}>
                📳 Dica: Chacoalhe o celular para sincronizar!
              </Text>
              <TextInput
                style={[styles.searchInput, isDarkMode && styles.darkSearchInput]}
                value={buscaPais}
                onChangeText={setBuscaPais}
                placeholder="Buscar um país"
                placeholderTextColor="#A99486"
                returnKeyType="search"
              />
            </View>
          }
          ListEmptyComponent={
            <Text style={[styles.emptyText, isDarkMode && styles.darkSecondaryText]}>
              Nenhum país encontrado.
            </Text>
          }
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf3ea',
  },
  darkContainer: {
    backgroundColor: '#0F172A',
  },
  listContent: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    paddingRight: 12,
  },
  themeToggle: {
    alignItems: 'center',
  },
  themeLabel: {
    fontSize: 11,
    color: '#5A3A2A',
    fontWeight: '700',
    marginBottom: 2,
  },
  darkText: {
    color: '#F8FAFC',
  },
  darkSecondaryText: {
    color: '#CBD5E1',
  },
  darkArrowText: {
    color: '#0F172A',
  },
  welcome: {
    fontSize: 16,
    color: '#3D2314',
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3D2314',
    marginTop: 4,
  },
  hintText: {
    fontSize: 12,
    color: '#439245',
    marginTop: 8,
    fontWeight: '600',
  },
  searchInput: {
    height: 50,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5DCD4',
    borderRadius: 14,
    color: '#3D2314',
    paddingHorizontal: 15,
    fontSize: 15,
    marginTop: 18,
  },
  darkSearchInput: {
    backgroundColor: '#1E293B',
    borderColor: '#475569',
    color: '#F8FAFC',
  },
  emptyText: {
    color: '#6E6E6E',
    textAlign: 'center',
    marginTop: 24,
    fontSize: 14,
  },
  networkStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  networkDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 7,
  },
  networkOnline: {
    backgroundColor: '#439245',
  },
  networkOffline: {
    backgroundColor: '#C0392B',
  },
  networkChecking: {
    backgroundColor: '#B38B35',
  },
  networkText: {
    fontSize: 13,
    color: '#5A3A2A',
    fontWeight: '700',
  },
  card: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#3D2314',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardEmoji: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 35,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 16,
  },
  ongNome: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3D2314',
  },
  ongDetails: {
    fontSize: 14,
    color: '#5A3A2A',
    marginTop: 2,
  },
  ongCity: {
    fontSize: 12,
    color: '#9A7A6A',
    marginTop: 6,
  },
  arrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3D2314',
  },
});