// Supabase URL and Anon Key
const SUPABASE_URL = 'https://qyqixwklnfflhbqxeymr.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5cWl4d2tsbmZmbGhicXhleW1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwOTM2OTcsImV4cCI6MjA1NjY2OTY5N30.uGyICesgvRZ-T3TpmTwXwK-jy3jh2kEervZZaHiSBCo'; // Replace with your Supabase Anon Key

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function to send a message
async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    const user = 'User1';  // Replace with dynamic user if needed

    if (message.trim() === '') {
        return;
    }

    // Insert the message into the 'chats' table in Supabase
    const { data, error } = await supabase
        .from('chats')
        .insert([{ message: message, user: user }]);

    if (error) {
        console.error('Error sending message:', error);
    } else {
        console.log('Message sent:', data);
        messageInput.value = '';
    }
}

// Function to load messages
async function loadMessages() {
    const { data, error } = await supabase
        .from('chats')
        .select('*')
        .order('timestamp', { ascending: true });

    if (error) {
        console.error('Error loading messages:', error);
    } else {
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML = '';

        data.forEach((message) => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.innerHTML = `<strong>${message.user}:</strong> ${message.message} <em>(${new Date(message.timestamp).toLocaleString()})</em>`;
            messagesDiv.appendChild(messageElement);
        }
    }
}

// Realtime subscription to chat messages
supabase
    .channel('chats')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'chats' }, loadMessages)
    .subscribe();

// Load initial messages when the page loads
loadMessages();