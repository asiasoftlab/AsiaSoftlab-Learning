import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatDto } from './dto/chat.dto';
// Note: Can add JwtAuthGuard if we want to restrict to logged-in users.

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Body() chatDto: ChatDto) {
    return this.aiService.chat(chatDto);
  }
}
