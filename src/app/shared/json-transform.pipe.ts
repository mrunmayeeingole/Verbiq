import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonTransform'
})
export class JsonTransformPipe implements PipeTransform {
  transform(value: string): any {
    if (!value || typeof value !== 'string') return null; // Ensure value is a string

    const jsonData: any = {};

    // Extract different parts using improved regex patterns
    jsonData.language_assessment = {
      speaker_information: this.extractSection(value, 'Speaker Information:\\*', '\\*Speech Transcription:'),
      speech_transcription: this.extractSection(value, '\\*Speech Transcription:', 'Evaluation Results:'),
      evaluation_results: {
        pronunciation_accuracy: this.extractScore(value, 'Pronunciation Accuracy:\\*'),
        fluency_and_coherence: this.extractScore(value, '\\*Fluency and Coherence:\\*'),
        grammar_and_structure: this.extractScore(value, '\\*Grammar and Sentence Structure:\\*'),
        overall_score: this.extractScore(value, '\\*Overall Proficiency Score \\(0-10\\):'),
        proficiency_level: this.extractSection(value, '\\*Proficiency Score \\(A1-C2\\):', 'Overall,')
      },
      recommendations: this.extractRecommendations(value)
    };

    return jsonData;
  }

  private extractSection(value: string, startPattern: string, endPattern: string): string {
    const regex = new RegExp(`${startPattern}([\\s\\S]*?)${endPattern}`, 'i'); // Case insensitive match
    const match = value.match(regex);
    return match ? match[1].trim() : '';
  }

  private extractScore(value: string, pattern: string): number {
    const regex = new RegExp(`${pattern}\\s*(\\d+(\\.\\d+)?)`);
    const match = value.match(regex);
    return match ? parseFloat(match[1]) : 0;
  }

  private extractRecommendations(value: string): string[] {
    const regex = /\*Recommendations for Improvement:([\s\S]*)/; // Extract section after 'Recommendations'
    const match = value.match(regex);
    if (!match) return [];
    
    return match[1]
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('*')) // Ensure only valid recommendations
      .map(line => line.replace('*', '').trim()); // Remove '*' and trim spaces
  }
}
