import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, X, Save, User, Target, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LearnerLayout from '@/components/LearnerLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useRealtimeSingle } from '@/hooks/useRealtimeQuery';

const LearnerProfileEdit = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: learnerProfile, loading } = useRealtimeSingle({
    table: 'learner_profiles',
    filter: user ? { column: 'user_id', value: user.id } : undefined,
    enabled: !!user,
  });

  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [skillsInterested, setSkillsInterested] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState('beginner');
  const [learningGoals, setLearningGoals] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newLang, setNewLang] = useState('');

  const popularSkills = ['React', 'Python', 'Data Science', 'UI/UX Design', 'Machine Learning', 'Node.js', 'Product Management', 'Digital Marketing', 'AWS', 'Java', 'TypeScript', 'DevOps'];

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setAvatarUrl(profile.avatar_url || '');
      setBio(profile.bio || '');
      setLocation(profile.location || '');
      setPhone(profile.phone || '');
      setLanguages(profile.languages || []);
    }
  }, [profile]);

  useEffect(() => {
    if (learnerProfile) {
      const lp = learnerProfile as any;
      setSkillsInterested(lp.skills_interested || []);
      setExperienceLevel(lp.experience_level || 'beginner');
      setLearningGoals(lp.learning_goals || '');
    }
  }, [learnerProfile]);

  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await supabase.from('profiles').update({
        full_name: fullName,
        avatar_url: avatarUrl,
        bio,
        location,
        phone,
        languages,
      }).eq('user_id', user.id);

      const learnerData = {
        user_id: user.id,
        skills_interested: skillsInterested,
        experience_level: experienceLevel,
        learning_goals: learningGoals,
      };

      if (learnerProfile) {
        await supabase.from('learner_profiles').update(learnerData).eq('user_id', user.id);
      } else {
        await supabase.from('learner_profiles').insert(learnerData);
      }

      toast({ title: 'Profile Updated', description: 'Your profile has been saved.' });
      navigate('/dashboard');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !user) return;
    const file = e.target.files[0];
    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('avatars').upload(filePath, file);
    if (error) { toast({ title: 'Upload failed', description: error.message, variant: 'destructive' }); return; }
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
    setAvatarUrl(publicUrl);
  };

  const initials = fullName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'L';

  if (loading) {
    return <LearnerLayout><div className="p-8 text-center text-muted-foreground">Loading profile...</div></LearnerLayout>;
  }

  return (
    <LearnerLayout>
      <div className="p-6 md:p-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-1">Edit Profile</h1>
        <p className="text-muted-foreground mb-6">Update your learner profile</p>

        {/* Profile Picture */}
        <Card className="mb-6">
          <CardContent className="p-5 flex items-center gap-4">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">{initials}</div>
            )}
            <div>
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}><Upload className="h-3 w-3 mr-1" />Upload Photo</Button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              <p className="text-xs text-muted-foreground mt-1">JPG or PNG, max 2MB</p>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card className="mb-6">
          <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Full Name</label><Input value={fullName} onChange={e => setFullName(e.target.value)} /></div>
              <div><label className="block text-sm font-medium mb-1">Location</label><Input value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Country" /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1">Bio</label><Textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Tell us about yourself..." /></div>
            <div><label className="block text-sm font-medium mb-1">Phone</label><Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXXXXXXX" /></div>
            <div>
              <label className="block text-sm font-medium mb-2">Languages</label>
              <div className="flex gap-2 mb-2">
                <Input placeholder="Add language" value={newLang} onChange={e => setNewLang(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (newLang && !languages.includes(newLang)) { setLanguages([...languages, newLang]); setNewLang(''); } } }} />
                <Button type="button" onClick={() => { if (newLang && !languages.includes(newLang)) { setLanguages([...languages, newLang]); setNewLang(''); } }} disabled={!newLang}><Plus className="h-4 w-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">{languages.map(l => <Badge key={l} variant="secondary" className="cursor-pointer" onClick={() => setLanguages(languages.filter(x => x !== l))}>{l}<X className="h-3 w-3 ml-1" /></Badge>)}</div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Preferences */}
        <Card className="mb-6">
          <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" />Learning Preferences</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Experience Level</label>
              <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Skills I Want to Learn</label>
              <div className="flex gap-2 mb-2">
                <Input placeholder="Add skill" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (newSkill && !skillsInterested.includes(newSkill)) { setSkillsInterested([...skillsInterested, newSkill]); setNewSkill(''); } } }} />
                <Button type="button" onClick={() => { if (newSkill && !skillsInterested.includes(newSkill)) { setSkillsInterested([...skillsInterested, newSkill]); setNewSkill(''); } }} disabled={!newSkill}><Plus className="h-4 w-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {popularSkills.map(s => (
                  <Badge key={s} variant={skillsInterested.includes(s) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => {
                    if (skillsInterested.includes(s)) setSkillsInterested(skillsInterested.filter(x => x !== s));
                    else setSkillsInterested([...skillsInterested, s]);
                  }}>{s}</Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {skillsInterested.filter(s => !popularSkills.includes(s)).map(s => (
                  <Badge key={s} variant="default" className="cursor-pointer" onClick={() => setSkillsInterested(skillsInterested.filter(x => x !== s))}>{s}<X className="h-3 w-3 ml-1" /></Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card className="mb-8">
          <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" />Learning Goals</CardTitle></CardHeader>
          <CardContent>
            <Textarea value={learningGoals} onChange={e => setLearningGoals(e.target.value)} rows={4} placeholder="What do you want to achieve? E.g., 'Build a full-stack web app', 'Get a job in data science'..." />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={isLoading}><Save className="h-4 w-4 mr-1" />{isLoading ? 'Saving...' : 'Save Changes'}</Button>
          <Button variant="outline" onClick={() => navigate('/dashboard')} disabled={isLoading}>Cancel</Button>
        </div>
      </div>
    </LearnerLayout>
  );
};

export default LearnerProfileEdit;
