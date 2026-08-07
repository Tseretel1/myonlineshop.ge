import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../services/ThemeService';

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
export class BackgroundComponent implements OnInit, OnDestroy {
  shapes: Shape[] = [];
  enabled: boolean = true;

  private themeSub!: Subscription;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeSub = this.themeService.settings$.subscribe((settings) => {
      this.enabled = settings ? settings.backgroundAnimationEnabled : true;
      const shapeType: ShapeType = settings ? settings.backgroundAnimationShape : 'blob';
      this.shapes = this.enabled ? this.generateShapes(32, shapeType) : [];
    });
  }

  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }

  private generateShapes(count: number, type: ShapeType): Shape[] {
    return Array.from({ length: count }, () => ({
      type,
      size: Math.round(10 + Math.random() * 56),
      left: Math.round(Math.random() * 100),
      duration: Math.round(16 + Math.random() * 22),
      delay: -Math.round(Math.random() * 30),
    }));
  }
}
