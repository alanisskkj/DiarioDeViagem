import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FotoViagem, Pais, RootStackParamList, TabParamList, ThemeContext, ViagemContext } from './types/navigations';

import Login from './screens/Login';
import Home from './screens/Home';
import Perfil from './screens/Perfil';
import Detalhes from './screens/Detalhes';
import Cadastro from './screens/Cadastro';

const initialPaises: Pais[] = [
  { id: 'brasil', nome: 'Brasil', cor: '#DDF3E4', emoji: '🇧🇷', fotos: [{ id: 'br-1', local: 'Rio de Janeiro', descricao: 'Um fim de tarde inesquecível perto do mar.', data: '15/01/2025', imagemUri: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=900' }] },
  { id: 'italia', nome: 'Itália', cor: '#F7E4D7', emoji: '🇮🇹', fotos: [{ id: 'it-1', local: 'Roma', descricao: 'Caminhando pelas ruas históricas da cidade.', data: '08/04/2025', imagemUri: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=900' }] },
  { id: 'franca', nome: 'França', cor: '#E4E8F7', emoji: '🇫🇷', fotos: [{ id: 'fr-1', local: 'Paris', descricao: 'A vista da Torre Eiffel ao anoitecer.', data: '22/06/2025', imagemUri: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900' }] },
  { id: 'japao', nome: 'Japão', cor: '#F8E1E1', emoji: '🇯🇵', fotos: [{ id: 'jp-1', local: 'Quioto', descricao: 'Templos, jardins e muita tranquilidade.', data: '03/10/2025', imagemUri: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900' }] },
  { id: 'portugal', nome: 'Portugal', cor: '#F8EED8', emoji: '🇵🇹', fotos: [{ id: 'pt-1', local: 'Lisboa', descricao: 'Um passeio colorido pelas ladeiras de Lisboa.', data: '12/12/2025', imagemUri: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=900' }] },
];

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const STORAGE_THEME_KEY = '@travel-diary:theme_preference';

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={[tabStyles.iconWrap, focused && tabStyles.iconWrapActive]}>
      <Text style={tabStyles.emoji}>{emoji}</Text>
      {focused && <Text style={tabStyles.label}>{label}</Text>}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconWrap: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 25, gap: 8 },
  iconWrapActive: { backgroundColor: '#3D2314' },
  emoji: { fontSize: 26 },
  label: { fontSize: 16, fontWeight: '700', color: '#FFF' },
});

function TabNavigator({ route }: any) {
  const usuario = route?.params?.usuario || 'Visitante';
  const { isDarkMode } = React.useContext(ThemeContext) ?? { isDarkMode: false };
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarShowLabel: false, tabBarStyle: { height: Platform.OS === 'ios' ? 100 : 80, backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF', borderTopColor: isDarkMode ? '#334155' : '#E2E8F0' } }}>
      <Tab.Screen name="Explorar" component={Home} initialParams={{ usuario }} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🗺️" label="Destinos" focused={focused} /> }} />
      <Tab.Screen name="Cadastro" component={Cadastro} initialParams={{ usuario }} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📸" label="Registrar" focused={focused} /> }} />
      <Tab.Screen name="Perfil" component={Perfil} initialParams={{ usuario }} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Perfil" focused={focused} /> }} />
    </Tab.Navigator>
  );
}

export default function AppNavigation() {
  const [paises, setPaises] = useState<Pais[]>(initialPaises);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_THEME_KEY).then((savedTheme) => {
      if (savedTheme !== null) setIsDarkMode(savedTheme === 'dark');
    });
  }, []);

  const toggleTheme = (value: boolean) => {
    setIsDarkMode(value);
    AsyncStorage.setItem(STORAGE_THEME_KEY, value ? 'dark' : 'light').catch(() => undefined);
  };

  const adicionarViagem = (paisId: string, foto: FotoViagem) => {
    setPaises((current) => current.map((pais) => (
      pais.id === paisId ? { ...pais, fotos: [foto, ...pais.fotos] } : pais
    )));
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ViagemContext.Provider value={{ paises, adicionarViagem }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="OngDetalhes" component={Detalhes} options={{ headerShown: true, headerTitle: '', headerStyle: { backgroundColor: isDarkMode ? '#0F172A' : '#FDF6EE' }, headerShadowVisible: false }} />
        </Stack.Navigator>
      </ViagemContext.Provider>
    </ThemeContext.Provider>
  );
}


