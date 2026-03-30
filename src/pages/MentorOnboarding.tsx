import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, ChevronLeft, Upload, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const teachableSkills = ['React', 'Node.js', 'Python', 'Data Science', 'UI/UX Design', 'Digital Marketing', 'Cloud Computing', 'AI/ML', 'DevOps', 'Mobile Development', 'Product Management', 'SEO'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MentorOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [skills, setSkills] = useState<string[]>([]);
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState(1000);
  const [availability, setAvailability] = useState<Record<string, boolean>>(
    Object.fromEntries(days.map(d => [d, d !== 'Sunday']))
  );
  const totalSteps = 7;

  const toggleSkill = (skill: string) => {
    setSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b bg-card">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-lg font-bold">Windows<span className="text-accent">Learning</span></span>
          <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
        </div>
      </div>

      <div className="container max-w-2xl mx-auto px-4 py-4">
        <Progress value={(step / totalSteps) * 100} className="h-2" />
      </div>

      <main className="flex-1 container max-w-2xl mx-auto px-4 py-8">
        {step === 1 && (
          <div className="space-y-6">
            <div><h2 className="text-2xl font-bold">What skills do you teach?</h2>
              <p className="text-muted-foreground mt-1">Select your areas of expertise.</p></div>
            <div className="flex flex-wrap gap-2">
              {teachableSkills.map(skill => (
                <Badge key={skill} variant={skills.includes(skill) ? 'default' : 'outline'}
                  className="cursor-pointer text-sm py-1.5 px-3" onClick={() => toggleSkill(skill)}>
                  {skills.includes(skill) && <Check className="h-3 w-3 mr-1" />}{skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div><h2 className="text-2xl font-bold">Professional Headline</h2>
              <p className="text-muted-foreground mt-1">This appears on your public profile.</p></div>
            <input type="text" value={headline} onChange={e => setHeadline(e.target.value)}
              placeholder="e.g., Senior Full-Stack Developer at Google"
              className="w-full h-12 px-4 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div><h2 className="text-2xl font-bold">Tell us about yourself</h2>
              <p className="text-muted-foreground mt-1">Share your teaching philosophy and experience.</p></div>
            <textarea value={bio} onChange={e => setBio(e.target.value)}
              placeholder="Share your experience, teaching style, and what learners can expect..."
              className="w-full h-40 p-4 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div><h2 className="text-2xl font-bold">Set your hourly rate</h2>
              <p className="text-muted-foreground mt-1">You can change this anytime.</p></div>
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-primary">₹{hourlyRate}</div>
              <input type="range" min={500} max={5000} step={100} value={hourlyRate}
                onChange={e => setHourlyRate(Number(e.target.value))}
                className="w-full accent-primary" />
              <div className="flex justify-between text-xs text-muted-foreground"><span>₹500</span><span>₹5,000</span></div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div><h2 className="text-2xl font-bold">Work Experience</h2>
              <p className="text-muted-foreground mt-1">Add your relevant experience.</p></div>
            <div className="space-y-3">
              <input placeholder="Company" className="w-full h-10 px-4 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              <input placeholder="Position" className="w-full h-10 px-4 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Start Year" className="h-10 px-4 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <input placeholder="End Year" className="h-10 px-4 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <Button variant="outline" size="sm" className="gap-1"><Plus className="h-3 w-3" /> Add More</Button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6">
            <div><h2 className="text-2xl font-bold">Set your availability</h2>
              <p className="text-muted-foreground mt-1">Select days you're available for sessions.</p></div>
            <div className="space-y-2">
              {days.map(day => (
                <label key={day} className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-secondary/50">
                  <span className="font-medium text-sm">{day}</span>
                  <input type="checkbox" checked={availability[day]} onChange={() => setAvailability(prev => ({ ...prev, [day]: !prev[day] }))}
                    className="rounded border-border" />
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-6">
            <div><h2 className="text-2xl font-bold">Upload ID for verification</h2>
              <p className="text-muted-foreground mt-1">We verify all mentors for learner safety. Upload Aadhaar or any government ID.</p></div>
            <div className="border-2 border-dashed rounded-xl p-8 text-center space-y-3">
              <Upload className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
              <Button variant="outline">Choose File</Button>
            </div>
          </div>
        )}
      </main>

      <div className="border-t bg-card">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex justify-between">
          <Button variant="ghost" onClick={() => step > 1 && setStep(step - 1)} disabled={step === 1}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          {step < totalSteps ? (
            <Button onClick={() => setStep(step + 1)}>Next <ChevronRight className="h-4 w-4 ml-1" /></Button>
          ) : (
            <Button onClick={() => navigate('/mentor/verification-pending')}>Submit for Verification</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorOnboarding;
