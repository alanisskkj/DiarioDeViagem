import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    ScrollView,
    Alert,
    Dimensions,
    Modal
} from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TabParamList, RootStackParamList, useTheme } from '../types/navigations';
import { SafeAreaView } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';

type Props = CompositeScreenProps<
    BottomTabScreenProps<TabParamList, 'Perfil'>,
    NativeStackScreenProps<RootStackParamList>
>;

const MENU_ITEMS = [
    { emoji: '📸', label: 'Minhas viagens', sub: 'Memórias registradas', action: 'viagens' },
    { emoji: '🗺️', label: 'Países visitados', sub: 'Sua coleção de destinos', action: 'paises' },
    { emoji: '🔔', label: 'Notificações', sub: 'Ativadas', action: 'notificacoes' },
    { emoji: '⭐', label: 'Lugares favoritos', sub: 'Destinos salvos', action: 'favoritos' },
    { emoji: '⚙️', label: 'Configurações', sub: 'Conta e privacidade', action: 'config' },
];

const { width } = Dimensions.get('window');
const columnWidth = (width - 80) / 3;

export default function Perfil({ route, navigation }: Props) {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(null);
    const [interessesModalVisible, setInteressesModalVisible] = useState(false);
    const [interesseSelecionado, setInteresseSelecionado] = useState<string | null>(null);
    const { isDarkMode } = useTheme();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const avatarScale = useRef(new Animated.Value(0.7)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }),
            Animated.spring(avatarScale, {
                toValue: 1,
                tension: 60,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
            setIsInternetReachable(state.isInternetReachable);
        });

        return unsubscribe;
    }, []);

    const handleEditInteresses = () => {
        setInteressesModalVisible(true);
    };

    const salvarInteresse = () => {
        if (!interesseSelecionado) {
            return;
        }

        setInteressesModalVisible(false);
        Alert.alert('Salvo!', `Interesse em ${interesseSelecionado} atualizado.`);
    };

    const handleMenuItem = (action: string) => {
        Alert.alert('Em breve!', `A funcionalidade "${action}" estará disponível em breve. 🐾`);
    };

    const usuario = route.params?.usuario || 'Visitante';
    const inicial = usuario.charAt(0).toUpperCase();

    return (
        <SafeAreaView style={[styles.root, isDarkMode && styles.darkRoot]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                { }
                <View style={[styles.headerBg, isDarkMode && styles.darkHeaderBg]}>
                    <View style={styles.blobHeader1} />
                    <View style={styles.blobHeader2} />
                </View>

                <Animated.View
                    style={[
                        styles.container,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    { }
                    <Animated.View
                        style={[
                            styles.avatarArea,
                            { transform: [{ scale: avatarScale }] },
                        ]}
                    >
                        <View style={styles.avatarCircle}>
                            <Text style={styles.avatarText}>{inicial}</Text>
                        </View>
                        <View style={styles.avatarBadge}>
                            <Text style={styles.avatarBadgeText}>🐾</Text>
                        </View>
                    </Animated.View>

                    <Text style={[styles.userName, isDarkMode && styles.darkText]}>{usuario}</Text>
                    <Text style={[styles.userSub, isDarkMode && styles.darkSecondaryText]}>Voluntário Ativo</Text>

                    <View style={[styles.networkCard, isDarkMode && styles.darkCard]}>
                        <View style={[
                            styles.networkIcon,
                            { backgroundColor: isConnected === false ? '#FDE8E8' : '#E8F5E9' },
                        ]}>
                            <Ionicons
                                name={isConnected === false ? 'cloud-offline-outline' : 'wifi-outline'}
                                size={24}
                                color={isConnected === false ? '#D64545' : '#439245'}
                            />
                        </View>
                        <View style={styles.networkInfo}>
                            <Text style={[styles.networkLabel, isDarkMode && styles.darkSecondaryText]}>Status da rede</Text>
                            <Text style={[
                                styles.networkStatus,
                                { color: isConnected === false ? '#D64545' : '#439245' },
                            ]}>
                                {isConnected === null
                                    ? 'Verificando...'
                                    : isConnected
                                        ? 'Online'
                                        : 'Offline'}
                            </Text>
                        </View>
                        <View style={[
                            styles.networkDot,
                            { backgroundColor: isConnected === false ? '#D64545' : '#439245' },
                        ]} />
                        <Text style={[styles.networkInternet, isDarkMode && styles.darkSecondaryText]}>
                            {isInternetReachable === false ? 'Sem internet' : 'Internet OK'}
                        </Text>
                    </View>

                    <View style={[styles.statsCard, isDarkMode && styles.darkCard]}>
                        {[
                            { val: '5', label: 'Destinos', emoji: '🗺️' },
                            { val: '0', label: 'Favoritos', emoji: '⭐' },
                            { val: '0', label: 'Memórias', emoji: '📸' },
                        ].map((s, i) => (
                            <React.Fragment key={i}>
                                {i > 0 && <View style={styles.statDivider} />}
                                <View style={styles.stat}>
                                    <Text style={styles.statEmoji}>{s.emoji}</Text>
                                    <Text style={[styles.statVal, isDarkMode && styles.darkText]}>{s.val}</Text>
                                    <Text style={[styles.statLabel, isDarkMode && styles.darkSecondaryText]}>{s.label}</Text>
                                </View>
                            </React.Fragment>
                        ))}
                    </View>

                    { }
                    <View style={styles.tipCard}>
                        <Text style={styles.tipEmoji}>💡</Text>
                        <View style={styles.tipContent}>
                            <Text style={styles.tipTitle}>Sabia que?</Text>
                            <Text style={styles.tipText}>
                                Viajar traz novas histórias, amplia horizontes e transforma momentos em memórias.
                            </Text>
                        </View>
                    </View>

                    { }
                    <Text style={[styles.menuTitle, isDarkMode && styles.darkText]}>Minha conta</Text>
                    <View style={[styles.menuCard, isDarkMode && styles.darkCard]}>
                        {MENU_ITEMS.map((item, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[
                                    styles.menuItem,
                                    i < MENU_ITEMS.length - 1 && styles.menuItemBorder,
                                ]}
                                onPress={() => handleMenuItem(item.action)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.menuEmoji}>{item.emoji}</Text>
                                <View style={styles.menuText}>
                                    <Text style={[styles.menuLabel, isDarkMode && styles.darkText]}>{item.label}</Text>
                                    <Text style={[styles.menuSub, isDarkMode && styles.darkSecondaryText]}>{item.sub}</Text>
                                </View>
                                <Text style={styles.menuArrow}>›</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    { }
                    <TouchableOpacity
                        style={[styles.interessesBtn, isDarkMode && styles.darkInterestButton]}
                        onPress={handleEditInteresses}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.interessesText}>✨ Editar Interesses</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.logoutBtn}
                        onPress={() => navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Login' }] })}
                    >
                        <Text style={styles.logoutText}>Sair da conta</Text>
                    </TouchableOpacity>

                    <Text style={styles.version}>Travel Diary v1.0.0 · Alanis Venerruche de Carvalho 🎨</Text>
                </Animated.View>
            </ScrollView>

            <Modal
                visible={interessesModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setInteressesModalVisible(false)}
            >
                <View style={styles.dialogOverlay}>
                    <View style={[styles.dialogContent, isDarkMode && styles.darkCard]}>
                        <Text style={[styles.dialogTitle, isDarkMode && styles.darkText]}>Editar Interesses</Text>
                        <Text style={[styles.dialogDescription, isDarkMode && styles.darkSecondaryText]}>
                            Qual causa você prefere apoiar?
                        </Text>

                        {[
                            { label: 'Educação', emoji: '📚' },
                            { label: 'Meio Ambiente', emoji: '🌱' },
                            { label: 'Saúde', emoji: '🏥' },
                        ].map(causa => (
                            <TouchableOpacity
                                key={causa.label}
                                style={[
                                    styles.causeOption,
                                    interesseSelecionado === causa.label && styles.causeOptionSelected,
                                    isDarkMode && styles.darkCauseOption,
                                ]}
                                onPress={() => setInteresseSelecionado(causa.label)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.causeEmoji}>{causa.emoji}</Text>
                                <Text style={[styles.causeLabel, isDarkMode && styles.darkText]}>{causa.label}</Text>
                                <Text style={styles.causeCheck}>
                                    {interesseSelecionado === causa.label ? '✓' : ''}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        <View style={styles.dialogActions}>
                            <TouchableOpacity
                                style={styles.dialogCancel}
                                onPress={() => setInteressesModalVisible(false)}
                            >
                                <Text style={[styles.dialogCancelText, isDarkMode && styles.darkSecondaryText]}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.dialogSave,
                                    !interesseSelecionado && styles.dialogSaveDisabled,
                                ]}
                                onPress={salvarInteresse}
                                disabled={!interesseSelecionado}
                            >
                                <Text style={styles.dialogSaveText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#ecf3ea',
    },
    darkRoot: { backgroundColor: '#0F172A' },
    darkText: { color: '#F8FAFC' },
    darkSecondaryText: { color: '#CBD5E1' },
    headerBg: {
        height: 180,
        backgroundColor: '#439245',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
    },
    darkHeaderBg: { backgroundColor: '#14532D' },
    blobHeader1: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#ffffff',
        opacity: 0.2,
        top: -60,
        right: -40,
    },
    blobHeader2: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#9dea40',
        opacity: 0.15,
        bottom: -40,
        left: 30,
    },
    container: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 40,
    },
    avatarArea: {
        position: 'relative',
        marginBottom: 12,
    },
    avatarCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#87d66a',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#f2fdee',
        elevation: 8,
    },
    avatarText: {
        fontSize: 36,
        fontWeight: '800',
        color: '#FFF',
    },
    avatarBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FDF6EE',
    },
    avatarBadgeText: {
        fontSize: 14,
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
        color: '#3D2314',
    },
    userSub: {
        fontSize: 14,
        color: '#6e6e6e',
        marginTop: 2,
        fontStyle: 'italic',
    },
    networkCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 12,
        marginTop: 16,
        width: '100%',
        elevation: 3,
    },
    darkCard: { backgroundColor: '#1E293B' },
    networkIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    networkInfo: {
        flex: 1,
        marginLeft: 12,
    },
    networkLabel: {
        fontSize: 12,
        color: '#9A7A6A',
    },
    networkStatus: {
        fontSize: 16,
        fontWeight: '800',
        marginTop: 2,
    },
    networkDot: {
        width: 9,
        height: 9,
        borderRadius: 5,
        marginRight: 6,
    },
    networkInternet: {
        fontSize: 11,
        color: '#6e6e6e',
        fontWeight: '600',
    },
    galleryCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        marginTop: 20,
        width: '100%',
        elevation: 3,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#3D2314',
        marginBottom: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 12,
    },
    actionBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#439245',
        alignItems: 'center',
    },
    btnGallery: {
        backgroundColor: '#2ecc71',
    },
    actionBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 13,
    },
    listContent: {
        paddingVertical: 6,
    },
    thumbnail: {
        width: columnWidth,
        height: columnWidth,
        margin: 4,
        borderRadius: 8,
        backgroundColor: '#eee',
    },
    emptyText: {
        textAlign: 'center',
        marginVertical: 15,
        color: '#95a5a6',
        fontStyle: 'italic',
        fontSize: 13,
    },
    statsCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 18,
        marginTop: 16,
        width: '100%',
        elevation: 3,
    },
    stat: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#EDE0D4',
        marginVertical: 4,
    },
    statEmoji: {
        fontSize: 18,
        marginBottom: 4,
    },
    statVal: {
        fontSize: 20,
        fontWeight: '800',
        color: '#3D2314',
    },
    statLabel: {
        fontSize: 11,
        color: '#9A7A6A',
        fontWeight: '500',
        marginTop: 2,
    },
    tipCard: {
        flexDirection: 'row',
        backgroundColor: '#439245',
        borderRadius: 20,
        padding: 16,
        marginTop: 16,
        width: '100%',
        gap: 12,
        alignItems: 'center',
    },
    tipEmoji: {
        fontSize: 28,
    },
    tipContent: {
        flex: 1,
    },
    tipTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#b5eba8',
        marginBottom: 2,
    },
    tipText: {
        fontSize: 12,
        color: '#d0e5cb',
        lineHeight: 16,
    },
    menuTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#3D2314',
        alignSelf: 'flex-start',
        marginTop: 20,
        marginBottom: 10,
    },
    menuCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        width: '100%',
        elevation: 3,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F5EDE4',
    },
    menuEmoji: {
        fontSize: 18,
        width: 28,
        textAlign: 'center',
    },
    menuText: {
        flex: 1,
    },
    menuLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#3D2314',
    },
    menuSub: {
        fontSize: 11,
        color: '#9A7A6A',
    },
    menuArrow: {
        fontSize: 18,
        color: '#BBA89A',
    },
    interessesBtn: {
        marginTop: 20,
        width: '100%',
        height: 48,
        borderRadius: 14,
        backgroundColor: '#ecf3ea',
        borderWidth: 2,
        borderColor: '#439245',
        justifyContent: 'center',
        alignItems: 'center',
    },
    darkInterestButton: { backgroundColor: '#1E293B', borderColor: '#86EFAC' },
    interessesText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#439245',
    },
    dialogOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        justifyContent: 'center',
        padding: 24,
    },
    dialogContent: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        elevation: 10,
    },
    darkCauseOption: { borderColor: '#475569', backgroundColor: '#0F172A' },
    dialogTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#3D2314',
    },
    dialogDescription: {
        fontSize: 14,
        color: '#6e6e6e',
        marginTop: 6,
        marginBottom: 16,
    },
    causeOption: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 52,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        marginBottom: 10,
    },
    causeOptionSelected: {
        borderColor: '#439245',
        backgroundColor: '#ecf3ea',
    },
    causeEmoji: {
        fontSize: 20,
        marginRight: 10,
    },
    causeLabel: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#3D2314',
    },
    causeCheck: {
        width: 20,
        fontSize: 18,
        fontWeight: '800',
        color: '#439245',
        textAlign: 'center',
    },
    dialogActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 8,
    },
    dialogCancel: {
        justifyContent: 'center',
        paddingHorizontal: 14,
        height: 44,
    },
    dialogCancelText: {
        color: '#6e6e6e',
        fontWeight: '700',
    },
    dialogSave: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 44,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: '#439245',
    },
    dialogSaveDisabled: {
        backgroundColor: '#B8C7B5',
    },
    dialogSaveText: {
        color: '#FFF',
        fontWeight: '700',
    },
    logoutBtn: {
        marginTop: 10,
        width: '100%',
        height: 48,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#E05C5C',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#E05C5C',
    },
    version: {
        fontSize: 11,
        color: '#BBA89A',
        marginTop: 18,
    },
});