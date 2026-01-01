// Bible Verse Generator - Provides verses matching user's mental/emotional state

import { claudeClient } from './claudeClient';
import { MentalState, EmotionalState, BibleVerse } from '@/types/checkin';

export class BibleVerseGenerator {
  /**
   * Generate a Bible verse based on mental and emotional state
   */
  async generateVerse(
    mentalState: MentalState,
    emotionalState: EmotionalState,
    stress: number,
    clarity: number,
    emotionalIntensity: number
  ): Promise<BibleVerse> {
    const prompt = this.buildPrompt(
      mentalState,
      emotionalState,
      stress,
      clarity,
      emotionalIntensity
    );

    try {
      const response = await claudeClient.sendMessage(
        prompt,
        this.getSystemPrompt(),
        500 // Short max tokens for just a verse
      );

      return this.parseVerseFromAI(response.content);
    } catch (error) {
      console.error('❌ Bible verse generation failed:', error);
      // Return fallback verse
      return this.getFallbackVerse(emotionalState);
    }
  }

  /**
   * Build the prompt for Claude based on user's state
   */
  private buildPrompt(
    mentalState: MentalState,
    emotionalState: EmotionalState,
    stress: number,
    clarity: number,
    emotionalIntensity: number
  ): string {
    return `Select a Bible verse for today based on this state:

MENTAL STATE:
- State: ${mentalState} ${this.getMentalEmoji(mentalState)}
- Stress level: ${stress}/10 ${stress > 7 ? '⚠️ HIGH' : stress > 4 ? '😌 MODERATE' : '✅ LOW'}
- Mental clarity: ${clarity}/10

EMOTIONAL STATE:
- Primary emotion: ${emotionalState} ${this.getEmotionalEmoji(emotionalState)}
- Intensity: ${emotionalIntensity}/10

PROVIDE VERSE IN THIS EXACT JSON FORMAT:
\`\`\`json
{
  "reference": "<Book Chapter:Verse>",
  "text": "<Full verse text from NIV or ESV>",
  "reason": "<1 sentence why this verse fits their state today>"
}
\`\`\`

GUIDELINES:
1. Choose verses that speak to their CURRENT state (anxious → peace, joyful → gratitude, etc.)
2. Avoid cliche verses - choose thoughtfully based on nuance of their state
3. For high stress (>7): verses about God's peace, strength, or provision
4. For low clarity (<5): verses about wisdom, guidance, or trust
5. For emotional struggles: verses of comfort, hope, or encouragement
6. For positive states: verses of gratitude, worship, or mission
7. Use accurate verse references and complete verse text
8. Keep reason brief (1 sentence max)

Respond ONLY with JSON. No markdown, no explanation.`;
  }

  /**
   * System prompt for verse selection
   */
  private getSystemPrompt(): string {
    return `You are a pastoral care assistant helping select meaningful Bible verses for daily encouragement.

Your task: Select ONE appropriate Bible verse based on the user's mental and emotional state.

Key principles:
1. RELEVANCE - verse must genuinely speak to their current state
2. AUTHENTICITY - no generic "feel good" verses unless truly fitting
3. ACCURACY - use exact verse text and correct reference
4. ENCOURAGEMENT - point toward hope, strength, or God's character
5. WISDOM - match the nuance of their state (anxious vs overwhelmed vs heavy are different)

Respond ONLY with valid JSON. No markdown, no explanation.`;
  }

  /**
   * Parse Claude's response into a BibleVerse object
   */
  private parseVerseFromAI(aiResponse: string): BibleVerse {
    try {
      // Remove markdown code fences if present
      let cleaned = aiResponse
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const parsed = JSON.parse(cleaned);

      return {
        reference: parsed.reference,
        text: parsed.text,
        reason: parsed.reason,
      };
    } catch (error) {
      console.error('❌ Failed to parse Bible verse:', error);
      // Return a default encouraging verse
      return {
        reference: 'Philippians 4:13',
        text: 'I can do all things through Christ who strengthens me.',
        reason: 'A reminder of God\'s strength in all circumstances',
      };
    }
  }

  /**
   * Get fallback verse based on emotional state
   */
  private getFallbackVerse(emotionalState: EmotionalState): BibleVerse {
    const verses: Record<EmotionalState, BibleVerse> = {
      peaceful: {
        reference: 'Psalm 46:10',
        text: 'Be still, and know that I am God.',
        reason: 'Rest in God\'s presence during this peaceful state',
      },
      anxious: {
        reference: 'Philippians 4:6-7',
        text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.',
        reason: 'God\'s peace guards your anxious heart',
      },
      frustrated: {
        reference: 'Psalm 34:18',
        text: 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.',
        reason: 'God is near even in frustration',
      },
      sad: {
        reference: 'Psalm 30:5',
        text: 'Weeping may stay for the night, but rejoicing comes in the morning.',
        reason: 'Hope that joy will return',
      },
      joyful: {
        reference: 'Psalm 118:24',
        text: 'This is the day that the Lord has made; let us rejoice and be glad in it.',
        reason: 'Celebrate today with gratitude',
      },
      numb: {
        reference: 'Psalm 42:11',
        text: 'Why, my soul, are you downcast? Why so disturbed within me? Put your hope in God, for I will yet praise him, my Savior and my God.',
        reason: 'Even when numb, hope remains in God',
      },
    };

    return verses[emotionalState];
  }

  /**
   * Get emoji for mental state
   */
  private getMentalEmoji(state: MentalState): string {
    const emojis: Record<MentalState, string> = {
      clear: '😌',
      anxious: '😰',
      foggy: '🌫️',
      heavy: '😔',
      overwhelmed: '💭',
    };
    return emojis[state];
  }

  /**
   * Get emoji for emotional state
   */
  private getEmotionalEmoji(state: EmotionalState): string {
    const emojis: Record<EmotionalState, string> = {
      peaceful: '😌',
      anxious: '😰',
      frustrated: '😤',
      sad: '😢',
      joyful: '😊',
      numb: '😐',
    };
    return emojis[state];
  }
}

// Export singleton instance
export const bibleVerseGenerator = new BibleVerseGenerator();
