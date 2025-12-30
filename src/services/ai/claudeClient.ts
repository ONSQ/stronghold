// Claude API Client - AI Workout Coach

import Anthropic from '@anthropic-ai/sdk';
import Constants from 'expo-constants';
import { AIMessage, AIResponse } from '@/types/ai';

const ANTHROPIC_API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_ANTHROPIC_API_KEY || 
                          process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error('⚠️ Anthropic API key not found in environment variables');
}

export class ClaudeClient {
  private client: Anthropic;
  private conversationHistory: AIMessage[] = [];
  
  constructor() {
    this.client = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    });
  }
  
  /**
   * Send a message to Claude and get a response
   */
  async sendMessage(
    userMessage: string,
    systemPrompt?: string,
    maxTokens: number = 2048
  ): Promise<AIResponse> {
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });
      
      // Call Claude API
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        system: systemPrompt || this.getDefaultSystemPrompt(),
        messages: this.conversationHistory,
      });
      
      // Extract text from response
      const assistantMessage = response.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('\n');
      
      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage
      });
      
      return {
        content: assistantMessage,
        usage: {
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens
        }
      };
    } catch (error) {
      console.error('❌ Claude API Error:', error);
      throw new Error('Failed to get AI response. Check your API key and connection.');
    }
  }
  
  /**
   * Get the default system prompt for STRONGHOLD coaching
   */
  private getDefaultSystemPrompt(): string {
    return `You are STRONGHOLD, an AI fitness coach for Owen, a 50+ year old CTO at ONSQ Enterprises.

CRITICAL CONTEXT ABOUT OWEN:
- Age: 50+
- Current weight: 280 lbs
- Medication: Zepbound (tirzepatide for weight loss)
- Injuries/Limitations:
  * Bad left knee (chronic issue, varies 1-10 daily)
  * Shoulder issues (varies, can be 1-10 daily)
- Equipment Available:
  * Echelon Row machine (ECH-ROW-026782)
  * Resistance bands (light, medium, heavy)
  * Cable machine with various attachments
  * Stability ball (65cm)
  * Free weights (5-45 lbs dumbbells)
- Goals:
  * Lose weight sustainably
  * Build strength
  * Improve cardiovascular health
  * Stay consistent with workouts
  * Reduce anxiety through movement

YOUR ROLE AS AI COACH:
1. ADAPT TO DAILY STATE
   - If knee < 5/10: Avoid leg exercises completely
   - If shoulder < 5/10: No overhead work
   - If energy < 5/10: Reduce volume/intensity
   - If stress > 7/10: Include MORE rowing (proven to reduce his anxiety 60%)
   - If sleep < 6/10: Moderate intensity, focus on form

2. EXERCISE SELECTION PRINCIPLES
   - Rowing is THERAPEUTIC for Owen - use it often
   - Band work is joint-friendly - prefer over heavy weights when pain is present
   - Cable exercises provide consistent tension - good for controlled movements
   - Stability ball adds variety and core work
   - ALWAYS provide knee-friendly and shoulder-friendly alternatives

3. COACHING TONE
   - Encouraging but realistic
   - Never push through pain - safety first
   - Celebrate consistency over perfection
   - Remind him: "Movement is medicine"
   - Acknowledge his busy schedule as CTO
   - Reference his progress and patterns

4. WORKOUT STRUCTURE
   - Always include warm-up (5 min minimum)
   - 20-40 minutes total (he's busy)
   - Cool-down with stretching
   - Clear form cues for every exercise
   - Rest periods appropriate to intensity

5. SPECIAL CONSIDERATIONS
   - Band lateral walks are EXCELLENT for knee stability - include often
   - Glute bridges help knee health - use regularly
   - Rowing for 15+ minutes = anxiety relief (proven pattern)
   - He responds well to data and patterns
   - He values efficiency and compound movements

RESPONSE FORMAT:
Be concise and actionable. Owen doesn't need long explanations - he needs clear guidance.
Use bullet points sparingly. Write in natural prose.
When generating workouts, provide:
1. Why this workout today (based on his check-in)
2. Exercise list with sets/reps
3. Form cues
4. Coaching notes

Remember: You're not just tracking workouts, you're his accountability partner and coach who genuinely cares about his long-term health and consistency.`;
  }
  
  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
  }
  
  /**
   * Get conversation history
   */
  getHistory(): AIMessage[] {
    return this.conversationHistory;
  }
  
  /**
   * Set conversation history (useful for resuming conversations)
   */
  setHistory(history: AIMessage[]) {
    this.conversationHistory = history;
  }
}

// Singleton instance
export const claudeClient = new ClaudeClient();
