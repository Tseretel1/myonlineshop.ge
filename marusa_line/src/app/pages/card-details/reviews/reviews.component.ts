import { Component ,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
 
export interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}
 

@Component({
  selector: 'app-reviews',
  imports: [CommonModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss'
})
export class ReviewsComponent implements OnInit{

  reviews: Review[] = [
    {
      id: 1,
      name: 'ნინო კვარაცხელია',
      avatar: 'ნკ',
      rating: 5,
      comment: 'პროდუქტი ზუსტად ისეთია, როგორც სურათზე. მიწოდება სწრაფი იყო, შეფუთვა მაღალი ხარისხის. განმეორებით შევიძენ!',
      date: '2024-03-10',
      verified: true,
    },
    {
      id: 2,
      name: 'გიორგი მამალაძე',
      avatar: 'გმ',
      rating: 4,
      comment: 'ძალიან კარგი ხარისხი ფასის გათვალისწინებით. კურიერი ოდნავ დაგვიანდა, მაგრამ საერთო შთაბეჭდილება დადებითია.',
      date: '2024-03-07',
      verified: true,
    },
    {
      id: 3,
      name: 'მარიამ ჯოხტაბერიძე',
      avatar: 'მჯ',
      rating: 5,
      comment: 'სრულყოფილი! სწორედ ის, რაც ვეძებდი. გამყიდველი ძალიან პასუხისმგებელია, ყველა კითხვაზე სწრაფად პასუხობდა.',
      date: '2024-03-05',
      verified: false,
    },
    {
      id: 4,
      name: 'დავით ბერიძე',
      avatar: 'დბ',
      rating: 3,
      comment: 'საშუალო ხარისხი. მოსალოდნელზე ოდნავ განსხვავებული, მაგრამ ზოგადად კარგი პროდუქტია.',
      date: '2024-02-28',
      verified: true,
    },
    {
      id: 5,
      name: 'ანა ტაბატაძე',
      avatar: 'ატ',
      rating: 5,
      comment: 'ვინმეს ვისაც ეს პროდუქტი ეჭვი ეპარება — ნუ დააყოვნებთ! ხარისხი შესანიშნავია, ფასი სამართლიანი.',
      date: '2024-02-22',
      verified: true,
    },
    {
      id: 6,
      name: 'ლუკა ღვინიანიძე',
      avatar: 'ლღ',
      rating: 4,
      comment: 'კარგი შენაძენი. შეფუთვა ძალიან მოვლილი იყო, სწრაფი მიტანა. მომდევნო ჯერ კიდევ ვიყიდი.',
      date: '2024-02-18',
      verified: false,
    },
    {
      id: 7,
      name: 'სოფო ელიზბარაშვილი',
      avatar: 'სე',
      rating: 2,
      comment: 'გარკვეული პრობლემები მქონდა შეკვეთასთან. მხარდაჭერამ საბოლოოდ გადაჭრა, მაგრამ ეს პროცესი დიდ დროს მოითხოვდა.',
      date: '2024-02-14',
      verified: true,
    },
    {
      id: 8,
      name: 'ელენე ჩხიკვაძე',
      avatar: 'ელ',
      rating: 5,
      comment: 'მეხუთეჯერ ვყიდულობ! ყოველ ჯერზე ერთნაირი ხარისხი. ეს მაღაზია ჩემი საყვარელია.',
      date: '2024-02-10',
      verified: true,
    },
    {
      id: 9,
      name: 'ბექა ნარიმანიძე',
      avatar: 'ბნ',
      rating: 4,
      comment: 'პროდუქტი ნამდვილად ღირს თავისი ფასი. მხოლოდ ერთი პატარა ნაკლი — ფერი ოდნავ განსხვავებული იყო.',
      date: '2024-02-05',
      verified: false,
    },
    {
      id: 10,
      name: 'თამარ კობახიძე',
      avatar: 'თკ',
      rating: 5,
      comment: 'საოცარი პროდუქტი! ჩემს მეგობრებს უკვე ვუსაჩუქრე. ყველა ძალიან კმაყოფილია.',
      date: '2024-01-30',
      verified: true,
    },
  ];
 
  averageRating: number = 0;
  ratingCounts: number[] = [0, 0, 0, 0, 0]; // index 0 = 1 star ... index 4 = 5 stars
  activeFilter: number = 0; // 0 = all
  filteredReviews: Review[] = [];
 
  ngOnInit(): void {
    this.calculateStats();
    this.filteredReviews = [...this.reviews];
  }
 
  calculateStats(): void {
    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
    this.averageRating = Math.round((total / this.reviews.length) * 10) / 10;
    console.log(this.reviews);
 
    this.ratingCounts = [0, 0, 0, 0, 0];
    this.reviews.forEach(r => {
      this.ratingCounts[r.rating - 1]++;
    });
  }
 
  filterBy(star: number): void {
    this.activeFilter = star;
    this.filteredReviews = star === 0
      ? [...this.reviews]
      : this.reviews.filter(r => r.rating === star);
  }
 
  getBarWidth(star: number): number {
    const count = this.ratingCounts[star - 1];
    return Math.round((count / this.reviews.length) * 100);
  }
 
  getStars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }
 
  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ka-GE', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}