import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CoursesRepository } from '../courses/courses.repository';
import { ChatDto } from './dto/chat.dto';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiService {
  constructor(private readonly coursesRepository: CoursesRepository) { }

  async chat(chatDto: ChatDto) {
    const { courseId, lessonId, message, history = [] } = chatDto;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException('GEMINI_API_KEY is not configured on the server.');
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      // Fetch course context
      const course = await this.coursesRepository.findById(courseId);
      if (!course) {
        throw new InternalServerErrorException('Course not found');
      }

      // Add lesson context if present
      let activeLessonContext = '';
      if (lessonId) {
        const lesson = course.lessons.find((l) => l.id === lessonId);
        if (lesson) {
          activeLessonContext = `The user is currently watching the lesson titled: "${lesson.title}". Lesson description: ${lesson.description}`;
        }
      }

      // Construct system prompt
      const systemInstruction = `
      You are an expert, helpful, and encouraging AI Doubt Solving Assistant for a learning platform called AsiaSoftlab Learning.
      The user is taking a course named "${course.title}".
      Course Description: ${course.description}
      Level: ${course.level}
      Category: ${course.category}
      Learning Objectives: ${course.learningObjectives?.join(', ') || 'Not specified'}
      
      ${activeLessonContext}
      
      Your goal is to answer the student's questions accurately, keeping your answers concise, structured (use markdown), 
      and directly related to the course content if applicable.
      If the user asks something completely unrelated to the course or technology, kindly steer them back to the topic.
      `;

      // Map history to the format expected by GenAI SDK
      // Note: The new @google/genai SDK (v0.1.2) expects history in { role: string, parts: [{ text: string }] } format for chats, or similar.
      // Alternatively, we can use generateContent with the system instruction and just format the whole history as text.
      // Since @google/genai allows chat sessions, let's use ai.chats.create

      const formattedHistory = history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }));

      const chatSession = ai.chats.create({
        model: 'gemini-3.6-flash',
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      // It seems with the new SDK we might have to pass history when creating chat or appending.
      // A simpler way for a stateless API is to just pass the conversation history as parts of generateContent.

      // Let's use generateContent for simplicity since we have the history array
      let contents: any[] = [];
      for (const h of history) {
        contents.push({ role: h.role, parts: [{ text: h.text }] });
      }
      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      return {
        reply: response.text,
      };
    } catch (error: any) {
      console.error('AI Service Error:', error);
      throw new InternalServerErrorException('Failed to communicate with AI model: ' + error.message);
    }
  }
}
