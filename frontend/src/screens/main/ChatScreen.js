import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  KeyboardAvoidingView, Platform, StyleSheet, Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES } from '../../constants/theme';
import { useApp } from '../../services/AppContext';
import { messagesAPI, conversationsAPI } from '../../services/api';
import GradientBackground from '../../components/GradientBackground';

const ChatScreen = ({ route }) => {
  const { conversationId, otherUserId, otherName, offerId } = route.params;
  const { t, session, scaledSize, colors, isDarkMode } = useApp();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [convId, setConvId] = useState(conversationId);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (!convId) return;
    fetchMessages();
    markAsRead();
    intervalRef.current = setInterval(fetchMessages, 3000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [convId]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const fetchMessages = async () => {
    if (!convId) return;
    try {
      const data = await messagesAPI.list(convId);
      if (data) setMessages(data);
    } catch (err) {
      console.error('fetchMessages error:', err);
    }
  };

  const markAsRead = async () => {
    if (!convId || !session?.user) return;
    try {
      await messagesAPI.markRead(convId);
    } catch (err) {
      console.error('markAsRead error:', err);
    }
  };

  const ensureConversation = async () => {
    if (convId) return convId;
    try {
      const conv = await conversationsAPI.create({
        student_id: session.user.id < otherUserId ? session.user.id : otherUserId,
        company_id: session.user.id < otherUserId ? otherUserId : session.user.id,
        offer_id: offerId || null,
      });
      setConvId(conv.id);
      return conv.id;
    } catch (err) {
      console.error('ensureConversation error:', err);
      return null;
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);

    const currentConvId = await ensureConversation();
    if (!currentConvId) {
      setSending(false);
      return;
    }

    try {
      await messagesAPI.send({
        conversation_id: currentConvId,
        receiver_id: otherUserId,
        content: newMessage.trim(),
      });
      setNewMessage('');
    } catch (err) {
      console.error('sendMessage error:', err);
    }
    setSending(false);
  };

  const isOwnMessage = (msg) => msg.sender_id === session?.user?.id;

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }) => {
    const own = isOwnMessage(item);
    return (
      <View style={[styles.msgRow, own ? styles.msgRowOwn : styles.msgRowOther]}>
        <View
          style={[
            styles.msgBubble,
            own ? [styles.msgBubbleOwn, { backgroundColor: colors.accent }] : [styles.msgBubbleOther, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', borderColor: colors.glassBorder }],
          ]}
          accessibilityRole="text"
        >
          <Text style={[styles.msgText, { fontSize: scaledSize(15), color: own ? '#fff' : colors.text }]}>
            {item.content}
          </Text>
          <Text style={[styles.msgTime, { fontSize: scaledSize(11) }]}>
            {formatTime(item.created_at)}
          </Text>
        </View>
      </View>
    );
  };

  const renderDateSeparator = (date) => (
    <View style={styles.dateSeparator}>
      <Text style={[styles.dateText, { color: colors.textTertiary, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>{date}</Text>
    </View>
  );

  return (
    <GradientBackground variant="subtle">
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top > 0 ? 8 : 16 }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backBtn, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', borderColor: colors.glassBorder }]}
            accessibilityRole="button"
            accessibilityLabel={t('back')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="chevron-left" size={24} color={isDarkMode ? "#fff" : colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <View style={[styles.headerAvatar, { backgroundColor: colors.accent + '22', borderWidth: 1, borderColor: colors.accent + '44' }]}>
              <Text style={[styles.headerAvatarText, { color: colors.accent }]}>
                {otherName?.substring(0, 2).toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.headerName, { fontSize: scaledSize(17), color: colors.text }]} numberOfLines={1}>
              {otherName}
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 10,
            paddingBottom: 10,
          }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
        />

        {/* Input bar */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          <View style={[styles.inputBar, { 
            backgroundColor: isDarkMode ? 'rgba(8, 16, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            borderTopColor: colors.glassBorder,
            paddingBottom: Math.max(insets.bottom, 12) 
          }]}>
            <TextInput
              style={[styles.input, { 
                fontSize: scaledSize(15), 
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                color: colors.text,
                borderColor: colors.glassBorder
              }]}
              placeholder={t('typeMessage')}
              placeholderTextColor={colors.textTertiary}
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={1000}
              accessibilityLabel={t('typeMessage')}
            />
            <TouchableOpacity
              onPress={sendMessage}
              disabled={!newMessage.trim() || sending}
              style={[
                styles.sendBtn,
                { backgroundColor: colors.accent },
                (!newMessage.trim() || sending) && { opacity: 0.4 },
              ]}
              accessibilityRole="button"
              accessibilityLabel={t('send')}
              accessibilityState={{ disabled: !newMessage.trim() || sending }}
            >
              <Feather name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.glassBorder,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  headerName: {
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  msgRow: {
    marginVertical: 3,
  },
  msgRowOwn: {
    alignItems: 'flex-end',
  },
  msgRowOther: {
    alignItems: 'flex-start',
  },
  msgBubble: {
    maxWidth: '78%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  msgBubbleOwn: {
    borderBottomRightRadius: 4,
  },
  msgBubbleOther: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  msgText: {
    color: '#fff',
    lineHeight: 21,
  },
  msgTime: {
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 12,
  },
  dateText: {
    color: COLORS.textTertiary,
    fontSize: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    borderWidth: 1,
    minHeight: 44,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default ChatScreen;
