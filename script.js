let currentService = '';
let userName = '';
let conversationState = 'greeting';
let lastContext = '';
let messageHistory = [];

// Intelligence features
const sentiment = {
    positive: ['happy', 'great', 'awesome', 'excellent', 'good', 'love', 'perfect', 'thanks', 'thank'],
    negative: ['bad', 'terrible', 'awful', 'poor', 'wrong', 'hate', 'disappointed', 'broken', 'issue', 'problem'],
    urgent: ['asap', 'emergency', 'urgent', 'quickly', 'fast', 'now'],
    price_conscious: ['expensive', 'cheap', 'afford', 'budget', 'cost', 'save', 'price', 'worth'],
    quality_focused: ['quality', 'best', 'reliable', 'trusted', 'genuine', 'authentic']
};

// Chatbot responses with enhanced intelligence
const responses = {
    greeting: ['Hi there! I\'m XDroid AI, your intelligent tech assistant. Before we begin, could you tell me your name? We pride ourselves on personal service and unbeatable value!'],
    nameResponse: name => [`Nice to meet you, ${name}! At XDroid Electronics, we offer quality parts without the premium price tag. How can I help you today?`,
                          `Welcome, ${name}! I'm here to help you find the best value in tech services and parts. What brings you in today?`,
                          `Great to have you here, ${name}! Ready to show you our unbeatable prices and quality service. What can I help you with?`],
    farewell: name => [`Goodbye, ${name}! Thank you for choosing XDroid Electronics!`,
                      `Take care, ${name}! Feel free to come back anytime for your tech needs!`,
                      `Have a great day, ${name}! Looking forward to helping you again!`],
    thanks: name => [`You're welcome, ${name}! I'm here to help!`,
                    `Anytime, ${name}! Your satisfaction is our priority!`,
                    `Glad I could help, ${name}! Don't hesitate to ask if you need anything else!`],
    
    // Context-aware responses
    followUp: {
        repair: [`Could you tell me more about when this problem started?`,
                `Have you noticed any other issues besides this?`,
                `Has anyone else tried to fix this before?`],
        urgent: [`I understand this is urgent. We do offer express service for critical repairs.`,
                `For urgent cases, we can prioritize your repair. Would you like to know about our express service?`],
        positive: [`I'm glad to hear that! Is there anything specific you'd like to know more about?`,
                  `That's great! How else can I assist you today?`],
        negative: [`I'm sorry to hear that. Let me help you resolve this issue.`,
                  `I understand your frustration. Let's find the best solution together.`]
    },

    // Service-specific intelligent responses
    mobile: {
        diagnostics: [`What symptoms is your phone showing? This will help me better understand the issue.`,
                     `When did you first notice the problem with your device?`,
                     `Have you tried any solutions already?`],
        repairs: [`Based on what you've described, this sounds like a {issue}. We can help fix that!`,
                 `This is a common issue we deal with. Our certified technicians can resolve this quickly.`],
        recommendation: [`Given your usage pattern, I'd recommend {solution}.`,
                        `Based on what you've told me, here's what I suggest: {solution}`]
    },

    computer: {
        diagnostics: [`What error messages, if any, are you seeing?`,
                     `Has your computer's performance changed recently?`,
                     `Are you experiencing any unusual sounds or behavior?`],
        repairs: [`This sounds like it might be a {issue}. Our technicians are experienced with these cases.`,
                 `Based on your description, we should look at {component} first.`],
        recommendation: [`For your needs, I would recommend {solution}.`,
                        `Given your requirements, here's what I suggest: {solution}`]
    },

    console: {
        diagnostics: [`What's happening when you try to use your console?`,
                     `Are you seeing any error codes or unusual behavior?`,
                     `When did you first notice the issue?`],
        repairs: [`This is consistent with a {issue}. We can definitely help with that.`,
                 `We've seen similar cases before. Our gaming specialists can fix this.`],
        recommendation: [`For your gaming setup, I'd recommend {solution}.`,
                        `Based on your gaming preferences, consider {solution}`]
    },

    pro: {
        consultation: [`Could you tell me more about your business requirements?`,
                      `What's your current setup and what improvements are you looking for?`,
                      `Are you looking for a custom solution or specific upgrades?`],
        recommendation: [`For your business needs, I recommend {solution}.`,
                        `Based on your requirements, here's a professional solution: {solution}`]
    },

    pricing: {
        general: [`Our pricing is simple and transparent: you only pay for the parts you need plus a small service fee. No hidden costs!`,
                 `We pride ourselves on offering competitive prices without compromising quality. Would you like specific pricing for any service?`,
                 `At XDroid Electronics, we believe in fair pricing. That's why we offer high-quality components at some of the most competitive prices around.`],
        parts: [`All our parts are sourced from reputable manufacturers and undergo thorough quality checks. What specific component are you looking for?`,
                `We offer genuine parts at competitive prices. Can you tell me which device you need parts for?`,
                `Our parts come with quality assurance at unbeatable prices. What component do you need?`],
        service: [`Our service fees are transparent and competitive. Let me know what service you need, and I'll provide detailed pricing.`,
                 `We keep our service charges reasonable while maintaining high-quality work. What type of service are you interested in?`],
        student: [`We offer special discounts for students! Do you have a valid student ID?`,
                 `Students can enjoy additional savings on our already competitive prices. Are you currently a student?`]
    },

    quality: {
        assurance: [`Every component we sell is sourced from reputable manufacturers and undergoes strict quality checks.`,
                   `We never compromise on quality - all our parts meet stringent standards before reaching customers.`,
                   `Quality is our priority: we only stock components from trusted suppliers with proven track records.`],
        warranty: [`Our parts come with warranty coverage for your peace of mind. Would you like to know more about our warranty terms?`,
                  `We stand behind our quality with comprehensive warranty coverage. Interested in the details?`]
    },

    community: {
        info: [`We're building a community of tech enthusiasts! Join our online platform for tutorials, project ideas, and tech discussions.`,
               `XDroid Electronics is more than a store - we're a hub for creators and innovators. Want to learn more about our community?`,
               `Connect with fellow tech enthusiasts in our community! We offer resources, tutorials, and project inspiration.`],
        resources: [`Check out our online resources for tutorials, project ideas, and technical guides. What topic interests you?`,
                   `Our community platform offers various learning resources. Would you like me to point you to specific tutorials?`],
        events: [`We regularly host community events and workshops. Would you like to know about upcoming events?`,
                `Stay tuned for our tech workshops and community meetups! Should I keep you updated on future events?`]
    },

    default: name => [`${name}, at XDroid Electronics, we offer quality parts and services at unbeatable prices. What can I help you with?`,
                     `How can I assist you today, ${name}? Whether it's repairs, parts, or tech advice, we're here to help at the best prices!`,
                     `${name}, feel free to ask about our services, pricing, or join our community of tech enthusiasts!`]
};

// Enhanced keyword detection
const keywords = {
    greeting: ['hello', 'hi', 'hey', 'howdy', 'greetings', 'morning', 'afternoon', 'evening'],
    farewell: ['bye', 'goodbye', 'see you', 'cya', 'farewell', 'later', 'night'],
    thanks: ['thank', 'thanks', 'appreciate', 'grateful'],
    repairs: ['repair', 'fix', 'broken', 'damage', 'not working', 'issue', 'problem'],
    mobile: ['phone', 'smartphone', 'iphone', 'android', 'samsung', 'screen', 'battery', 'charging'],
    computer: ['pc', 'laptop', 'desktop', 'mac', 'windows', 'computer', 'slow', 'virus', 'crash'],
    console: ['playstation', 'xbox', 'nintendo', 'ps4', 'ps5', 'switch', 'console', 'gaming', 'controller'],
    pro: ['professional', 'business', 'custom', 'enterprise', 'server', 'network'],
    pricing: ['price', 'cost', 'rate', 'much', 'quote', 'expensive', 'cheap', 'affordable', 'discount', 'student', 'fee', 'pricing'],
    quality: ['quality', 'warranty', 'genuine', 'authentic', 'reliable', 'trusted', 'guarantee'],
    community: ['community', 'tutorial', 'guide', 'learn', 'workshop', 'event', 'resource', 'forum'],
    parts: ['part', 'component', 'piece', 'replacement', 'spare', 'genuine'],
    value: ['value', 'worth', 'deal', 'bargain', 'save', 'saving', 'affordable'],
    location: ['where', 'location', 'address', 'directions', 'visit', 'shop']
};

// Analyze message sentiment
function analyzeSentiment(message) {
    const lowerMessage = message.toLowerCase();
    if (sentiment.positive.some(word => lowerMessage.includes(word))) return 'positive';
    if (sentiment.negative.some(word => lowerMessage.includes(word))) return 'negative';
    if (sentiment.urgent.some(word => lowerMessage.includes(word))) return 'urgent';
    if (sentiment.price_conscious.some(word => lowerMessage.includes(word))) return 'price_conscious';
    if (sentiment.quality_focused.some(word => lowerMessage.includes(word))) return 'quality_focused';
    return 'neutral';
}

// Get context from message
function getMessageContext(message) {
    const lowerMessage = message.toLowerCase();
    for (const [category, words] of Object.entries(keywords)) {
        if (words.some(word => lowerMessage.includes(word))) {
            return category;
        }
    }
    return 'general';
}

function selectService(service) {
    currentService = service;
    let message = '';
    switch(service) {
        case 'mobile':
            message = `${userName}, how can I help with your mobile device needs? We offer repairs, upgrades, and diagnostics for all smartphone brands.`;
            break;
        case 'computer':
            message = `${userName}, what computer services can I help you with? We handle repairs, upgrades, and custom builds for all types of computers.`;
            break;
        case 'console':
            message = `${userName}, need help with your gaming console? We repair and modify all major gaming systems!`;
            break;
        case 'pro':
            message = `${userName}, welcome to our Pro Services! How can we help with your professional or enterprise tech needs?`;
            break;
    }
    addMessage(message);
}

// Enhanced response generation
function getBotResponse(input) {
    if (!userName) {
        userName = input.split(' ')[0]; // Get first word as name
        conversationState = 'named';
        return getRandomResponse(responses.nameResponse(userName));
    }

    const sentiment = analyzeSentiment(input);
    const context = getMessageContext(input);
    messageHistory.push({ input, context, sentiment });

    // Handle sentiment-based responses
    if (sentiment !== 'neutral') {
        const sentimentResponse = getRandomResponse(responses.followUp[sentiment]);
        if (Math.random() < 0.3) { // 30% chance to add sentiment response
            return sentimentResponse;
        }
    }

    // Price-conscious customer handling
    if (sentiment.includes('price_conscious')) {
        return getRandomResponse(responses.pricing.general);
    }

    // Quality-focused customer handling
    if (sentiment.includes('quality_focused')) {
        return getRandomResponse(responses.quality.assurance);
    }

    // Service-specific responses
    if (currentService) {
        const serviceResponses = responses[currentService];
        if (serviceResponses) {
            if (context === 'repairs') {
                return getRandomResponse(serviceResponses.diagnostics);
            }
            if (context === currentService) {
                return getRandomResponse(serviceResponses.recommendation).replace('{solution}', 
                    getContextualSolution(currentService, messageHistory));
            }
        }
    }

    // Handle specific contexts
    if (context === 'pricing') {
        if (input.toLowerCase().includes('student')) {
            return getRandomResponse(responses.pricing.student);
        }
        if (input.toLowerCase().includes('part')) {
            return getRandomResponse(responses.pricing.parts);
        }
        return getRandomResponse(responses.pricing.general);
    }

    if (context === 'quality') {
        return getRandomResponse(responses.quality.assurance);
    }

    if (context === 'community') {
        if (input.toLowerCase().includes('event')) {
            return getRandomResponse(responses.community.events);
        }
        if (input.toLowerCase().includes('tutorial') || input.toLowerCase().includes('guide')) {
            return getRandomResponse(responses.community.resources);
        }
        return getRandomResponse(responses.community.info);
    }

    // General response handling
    if (context === 'farewell') return getRandomResponse(responses.farewell(userName));
    if (context === 'thanks') return getRandomResponse(responses.thanks(userName));
    
    // If no specific context, use default response
    return getRandomResponse(responses.default(userName));
}

// Get contextual solution based on service and history
function getContextualSolution(service, history) {
    const solutions = {
        mobile: ['our premium screen repair service', 'our battery replacement service', 'our water damage recovery service'],
        computer: ['our performance optimization package', 'our custom PC building service', 'our data recovery service'],
        console: ['our console modification service', 'our hardware upgrade package', 'our repair and maintenance service'],
        pro: ['our enterprise support package', 'our custom business solution', 'our professional upgrade service']
    };
    return solutions[service][Math.floor(Math.random() * solutions[service].length)];
}

// Get random response from array
function getRandomResponse(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Add message to chat
function addMessage(message, isUser = false) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = message;
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // Auto scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle sending message
function sendMessage() {
    const inputField = document.getElementById('user-input');
    const message = inputField.value.trim();
    
    if (message) {
        // Add user message
        addMessage(message, true);
        
        // Clear input
        inputField.value = '';
        
        // Get and add bot response after a short delay
        setTimeout(() => {
            const botResponse = getBotResponse(message);
            addMessage(botResponse);
        }, 500);
    }
}

// Handle Enter key
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Initial greeting
window.onload = () => {
    setTimeout(() => {
        addMessage(getRandomResponse(responses.greeting));
    }, 500);
};
