import { useParams, Link } from 'react-router-dom';
import { Star, CheckCircle, Zap, Clock, Users, Calendar, ArrowLeft } from 'lucide-react';
import { mentors, reviews } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const MentorProfile = () => {
  const { id } = useParams();
  const mentor = mentors.find(m => m.id === id);

  if (!mentor) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Mentor not found</h2>
            <Link to="/mentors" className="text-primary hover:underline">Browse all mentors</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const mentorReviews = reviews.filter(r => r.mentorId === mentor.id);
  const initials = mentor.name.split(' ').map(n => n[0]).join('');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-main py-8">
          <Link to="/mentors" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to mentors
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile header */}
              <div className="flex items-start gap-5">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold shrink-0">
                  {initials}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl md:text-3xl font-bold">{mentor.name}</h1>
                    {mentor.isVerified && <CheckCircle className="h-5 w-5 text-accent" />}
                    {mentor.isAvailableNow && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
                        <Zap className="h-3 w-3" /> Available Now
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground">{mentor.title}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold">{mentor.rating}</span>
                      <span className="text-xs text-muted-foreground">({mentor.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" /> {mentor.sessionsCompleted} sessions
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" /> {mentor.experience} years exp
                    </div>
                  </div>
                </div>
              </div>

              {/* About */}
              <div>
                <h3 className="text-lg font-semibold mb-3">About</h3>
                <p className="text-muted-foreground leading-relaxed">{mentor.bio}</p>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map(skill => (
                    <span key={skill} className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Reviews</h3>
                {mentorReviews.length > 0 ? (
                  <div className="space-y-4">
                    {mentorReviews.map(review => (
                      <div key={review.id} className="p-4 rounded-xl border bg-card">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                            {review.learnerName[0]}
                          </div>
                          <span className="text-sm font-medium">{review.learnerName}</span>
                          <div className="flex items-center gap-0.5 ml-auto">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No reviews yet for this mentor.</p>
                )}
              </div>
            </div>

            {/* Booking sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card border rounded-2xl p-6 shadow-card space-y-5">
                <div className="text-center">
                  <div className="text-3xl font-bold">₹{mentor.hourlyRate.toLocaleString('en-IN')}</div>
                  <span className="text-sm text-muted-foreground">per hour</span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Select session duration</h4>
                  {[
                    { hours: 1, label: '1 Hour Session' },
                    { hours: 2, label: '2 Hour Session' },
                    { hours: 4, label: '4 Hour Deep Dive' },
                  ].map(option => (
                    <button
                      key={option.hours}
                      className="w-full flex items-center justify-between p-3 rounded-lg border hover:border-primary/50 hover:bg-secondary/50 transition-all text-sm active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{option.label}</span>
                      </div>
                      <span className="font-bold tabular-nums">₹{(mentor.hourlyRate * option.hours).toLocaleString('en-IN')}</span>
                    </button>
                  ))}
                </div>

                <Button className="w-full h-12 text-base active:scale-[0.97] transition-all">
                  Book a Session
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Secure payment • 100% refund if session is cancelled
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MentorProfile;
