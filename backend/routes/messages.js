const router = require('express').Router();
const supabase = require('../supabase');
const authenticate = require('../middleware/auth');

// GET /api/messages/:conversationId
router.get('/:conversationId', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', req.params.conversationId)
    .order('created_at', { ascending: true });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// POST /api/messages
router.post('/', authenticate, async (req, res) => {
  const { conversation_id, receiver_id, content } = req.body;
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id,
      sender_id: req.user.id,
      receiver_id,
      content,
    })
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });

  // Update conversation last_message_at
  await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversation_id);

  res.json(data);
});

// PUT /api/messages/read/:conversationId — mark as read
router.put('/read/:conversationId', authenticate, async (req, res) => {
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('conversation_id', req.params.conversationId)
    .eq('receiver_id', req.user.id)
    .eq('read', false);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
