import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Animated,
  RefreshControl, StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES } from '../../constants/theme';
import { useApp } from '../../services/AppContext';
import { conversationsAPI } from '../../services/api';
import GradientBackground from '../../components/GradientBackground';
import GlassCard from '../../components/GlassCard';

const ConversationsScreen = () => {
  const { t, session, userRole, profile, scaledSize, colors } = useApp();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [conversations, setConversations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    if (!session?.user) return;
    try {
      const data = await conversationsAPI.list();
      if (data) setConversations(data);
    } catch (err) {
      console.error('fetchConversations error:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchConversations();
    }, [session, userRole])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchConversations();
    setRefreshing(false);
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return t('yesterday');
    } else if (days < 7) {
      return `${days}j`;
    }
    return date.toLocaleDateString();
  };

  const getOtherUser = (item) => {
    const isStudent = userRole === 'student';
    if (item.otherUserId) return { id: item.otherUserId, name: item.otherName || '' };
    const other = isStudent ? item.companies : item.students;
    const otherId = isStudent ? item.company_id : item.student_id;
    const otherName = other
      ? (other.company_name || `${other.first_name || ''} ${other.last_name || ''}`.trim())
      : '';
    return { id: otherId, name: otherName };
  };

  const getOtherInitials = (item) => {
    if (item.otherInitials) return item.otherInitials;
    const { name } = getOtherUser(item);
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  const getLastMessage = (item) => {
    if (item.lastMessage !== undefined) return item.lastMessage;
    if (item.messages && item.messages.length > 0) {
      const last = item.messages[item.messages.length - 1];
      return last.content || '...';
    }
    return '...';
  };

  const getLastMessageTime = (item) => {
    if (item.lastMessageTime) return item.lastMessageTime;
    if (item.messages && item.messages.length > 0) {
      return item.messages[item.messages.length - 1].created_at;
    }
    return item.updated_at || item.created_at || '';
  };

  const getIsOwnLastMessage = (item) => {
    if (item.isOwnLastMessage !== undefined) return item.isOwnLastMessage;
    if (item.messages && item.messages.length > 0) {
      return item.messages[item.messages.length - 1].sender_id === session?.user?.id;
    }
    return false;
  };

  const renderConversation = ({ item, index }) => {
    const otherUser = getOtherUser(item);
    const otherInitials = getOtherInitials(item);
    const lastMessage = getLastMessage(item);
    const lastMessageTime = getLastMessageTime(item);
    const isOwnLastMessage = getIsOwnLastMessage(item);

    return (
      <Animated.View style={{ opacity: 1, marginBottom: 12 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Chat', {
            conversationId: item.id,
            otherUserId: otherUser.id,
            otherName: otherUser.name,
            offerId: item.offer_id,
          })}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`${t('conversations')} ${otherUser.name}`}
          style={{ minHeight: 44 }}
        >
          <GlassCard style={{ padding: 0 }}>
            <View style={styles.convRow}>
              <View style={[styles.avatar, { backgroundColor: colors.accent + '22', borderWidth: 1, borderColor: colors.accent + '44' }]}>
                <Text style={[styles.avatarText, { color: colors.accent }]}>{otherInitials}</Text>
              </View>
              <View style={styles.convInfo}>
                <View style={styles.convHeader}>
                  <Text style={[styles.convName, { fontSize: scaledSize(16), color: colors.text }]} numberOfLines={1}>
                    {otherUser.name}
                  </Text>
                  <Text style={[styles.convTime, { fontSize: scaledSize(12), color: colors.textTertiary }]}>
                    {formatTime(lastMessageTime)}
                  </Text>
                </View>
                {item.offers?.title && (
                  <Text style={[styles.offerTag, { fontSize: scaledSize(12), color: colors.accent }]} numberOfLines={1}>
                    {item.offers.title}
                  </Text>
                )}
                <Text style={[styles.lastMsg, { fontSize: scaledSize(13), color: colors.textSecondary }]} numberOfLines={1}>
                  {isOwnLastMessage ? `${t('you')}: ` : ''}
                  {lastMessage}
                </Text>
              </View>
            </View>
          </GlassCard>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const EmptyState = () => (
    <GlassCard style={{ alignItems: 'center', padding: 30, marginTop: 40 }}>
      <Feather name="message-circle" size={60} color={colors.textTertiary} />
      <Text style={[styles.emptyTitle, { fontSize: scaledSize(18), color: colors.text }]}>{t('noConversations')}</Text>
      <Text style={[styles.emptyDesc, { fontSize: scaledSize(14), color: colors.textSecondary }]}>{t('noConversationsDesc')}</Text>
    </GlassCard>
  );

  return (
    <GradientBackground variant="default">
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={[styles.header, { paddingTop: insets.top > 0 ? 16 : 20 }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backBtn, { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: colors.glassBorder }]}
            accessibilityRole="button"
            accessibilityLabel={t('back')}
          >
            <Feather name="chevron-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: scaledSize(22), color: colors.text }]}>
            {t('messages')}
          </Text>
          <View style={{ width: 44 }} />
        </View>

        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 100,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.accent}
            />
          }
          ListEmptyComponent={!loading ? <EmptyState /> : null}
        />
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontWeight: '700',
    color: '#fff',
  },
  convRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  convInfo: {
    flex: 1,
  },
  convHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  convName: {
    fontWeight: '600',
    color: '#fff',
    flex: 1,
    marginRight: 8,
  },
  convTime: {
    color: COLORS.textTertiary,
  },
  offerTag: {
    color: COLORS.accent,
    marginBottom: 2,
  },
  lastMsg: {
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  emptyTitle: {
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDesc: {
    textAlign: 'center',
  },
});

export default ConversationsScreen;
