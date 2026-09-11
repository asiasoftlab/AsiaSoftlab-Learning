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

      // Fetch course context if provided
      let course: any = null;
      if (courseId) {
        course = await this.coursesRepository.findById(courseId);
        if (!course) {
          throw new InternalServerErrorException('Course not found');
        }
      }

      // Add lesson context if present
      let activeLessonContext = '';
      if (lessonId && course) {
        const lesson = course.lessons.find((l) => l.id === lessonId);
        if (lesson) {
          activeLessonContext = `The user is currently watching the lesson titled: "${lesson.title}". Lesson description: ${lesson.description}`;
        }
      }

      // Construct system prompt
      let systemInstruction = `
      You are an expert, helpful, and encouraging Support and Learning Assistant for a platform called Asia Softlab Virtual Academy.
      Your goal is to answer the user's questions accurately, keeping your answers concise and structured (use markdown).
      If the user asks something completely unrelated to learning, technology, or this platform, kindly steer them back to the topic.
      `;

      if (course) {
        systemInstruction += `
        The user is currently taking a course named "${course.title}".
        Course Description: ${course.description}
        Level: ${course.level}
        Category: ${course.category}
        Learning Objectives: ${course.learningObjectives?.join(', ') || 'Not specified'}
        
        ${activeLessonContext}
        `;
      }

      // Build conversation contents for generateContent
      const contents: any[] = [];
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
