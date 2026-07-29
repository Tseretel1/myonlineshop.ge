import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type ShapeType = 'circle' | 'square' | 'triangle' | 'blob';

interface Shape {
  type: ShapeType;
  size: number;
  left: number;
  duration: number;
  delay: number;
}

@Component({
  selector: 'app-background',
  imports: [CommonModule],
  templateUrl: './background.component.html',
  styleUrl: './background.component.scss'
})
export class BackgroundComponent {
  shapes: Shape[] = this.generateShapes(32);

  private generateShapes(count: number): Shape[] {
    const types: ShapeType[] = ['circle', 'square', 'triangle', 'blob'];
    return Array.from({ length: count }, () => ({
      type: types[Math.floor(Math.random() * types.length)],
      size: Math.round(10 + Math.random() * 36),
      left: Math.round(Math.random() * 100),
      duration: Math.round(16 + Math.random() * 22),
      delay: -Math.round(Math.random() * 30),
    }));
  }
}
