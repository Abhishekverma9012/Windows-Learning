import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, X, Save, User, Briefcase, Clock, DollarSign, Award, Languages as LanguagesIcon, CheckCircle, Star, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import MentorLayout from '@/components/MentorLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useRealtimeSingle } from '@/hooks/useRealtimeQuery';

interface PastExperience { company: string; role: string; years: string; }
interface Education { degree: string; institution: string; year: number; }
interface Certification { name: string; issuer: string; year: number; }
interface PackageDeal { sessions: number; price: number; savings: number; }
interface TimeOff { start: string; end: string; reason: string; }

const MentorProfileEdit = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: mentorProfile, loading: profileLoading } = useRealtimeSingle({
    table: 'mentor_profiles',
    filter: user ? { column: 'user_id', value: user.id } : undefined,
    enabled: !!user,
  });

  const [fullName, setFullName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [skillsData, setSkillsData] = useState<Record<string, string>>({});
  const [experienceYears, setExperienceYears] = useState(0);
  const [currentCompany, setCurrentCompany] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [pastExperience, setPastExperience] = useState<PastExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [currency, setCurrency] = useState('INR');
  const [packageDeals, setPackageDeals] = useState<PackageDeal[]>([]);
  const [freeConsultation, setFreeConsultation] = useState(false);
  const [weeklySchedule, setWeeklySchedule] = useState<Record<string, string[]>>({
    monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: []
  });
  const [timeZone, setTimeZone] = useState('Asia/Kolkata');
  const [responseTime, setResponseTime] = useState('');
  const [timeOff, setTimeOff] = useState<TimeOff[]>([]);
  const [idDocument, setIdDocument] = useState('');
  const [workVerification, setWorkVerification] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Temp form states
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newPastExp, setNewPastExp] = useState<PastExperience>({ company: '', role: '', years: '' });
  const [newEdu, setNewEdu] = useState<Education>({ degree: '', institution: '', year: new Date().getFullYear() });
  const [newCert, setNewCert] = useState<Certification>({ name: '', issuer: '', year: new Date().getFullYear() });
  const [newPkg, setNewPkg] = useState<PackageDeal>({ sessions: 0, price: 0, savings: 0 });
  const [newTimeOff, setNewTimeOff] = useState<TimeOff>({ start: '', end: '', reason: '' });

  const commonSkills = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'AWS', 'Docker', 'MongoDB', 'PostgreSQL', 'Machine Learning', 'Data Science', 'DevOps', 'UI/UX Design', 'Product Management', 'Agile'];
  const skillLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
  const timeZones = ['Asia/Kolkata', 'Asia/Dubai', 'Europe/London', 'America/New_York', 'America/Los_Angeles', 'Asia/Tokyo'];

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setProfileImage(profile.avatar_url || '');
      setLocation(profile.location || '');
      setLanguages(profile.languages || []);
    }
  }, [profile]);

  useEffect(() => {
    if (mentorProfile) {
      const mp = mentorProfile as any;
      setHeadline(mp.headline || '');
      setBio(mp.bio || '');
      setSkillsData(typeof mp.skills === 'object' && mp.skills ? mp.skills : {});
      setExperienceYears(mp.experience_years || 0);
      setCurrentCompany(mp.current_company || '');
      setJobRole(mp.job_role || '');
      setPastExperience(Array.isArray(mp.past_experience) ? mp.past_experience : []);
      setEducation(Array.isArray(mp.education) ? mp.education : []);
      setCertifications(Array.isArray(mp.certifications) ? mp.certifications : []);
      setHourlyRate(mp.hourly_rate || 0);
      setCurrency(mp.currency || 'INR');
      setPackageDeals(Array.isArray(mp.package_deals) ? mp.package_deals : []);
      setFreeConsultation(mp.free_consultation || false);
      setWeeklySchedule(typeof mp.weekly_schedule === 'object' && mp.weekly_schedule ? mp.weekly_schedule : { monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: [] });
      setTimeZone(mp.time_zone || 'Asia/Kolkata');
      setResponseTime(mp.response_time || '');
      setTimeOff(Array.isArray(mp.time_off) ? mp.time_off : []);
      setIdDocument(mp.id_document || '');
      setWorkVerification(mp.work_verification || '');
      if (mp.location) setLocation(mp.location);
      if (mp.languages?.length) setLanguages(mp.languages);
    }
  }, [mentorProfile]);

  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Update base profile
      await supabase.from('profiles').update({
        full_name: fullName,
        avatar_url: profileImage,
        location,
        languages,
      }).eq('user_id', user.id);

      // Upsert mentor profile
      const mentorData = {
        user_id: user.id,
        headline, bio, location, languages,
        skills: skillsData,
        experience_years: experienceYears,
        current_company: currentCompany,
        job_role: jobRole,
        past_experience: pastExperience as any,
        education: education as any,
        certifications: certifications as any,
        hourly_rate: hourlyRate,
        currency,
        package_deals: packageDeals as any,
        free_consultation: freeConsultation,
        weekly_schedule: weeklySchedule as any,
        time_zone: timeZone,
        response_time: responseTime,
        time_off: timeOff as any,
        id_document: idDocument,
        work_verification: workVerification,
      };

      if (mentorProfile) {
        await supabase.from('mentor_profiles').update(mentorData).eq('user_id', user.id);
      } else {
        await supabase.from('mentor_profiles').insert(mentorData);
      }

      toast({ title: 'Profile Updated', description: 'Your mentor profile has been saved.' });
      navigate('/mentor/dashboard');
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
    setProfileImage(publicUrl);
    toast({ title: 'Photo uploaded!' });
  };

  const initials = fullName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'M';

  if (profileLoading) {
    return <MentorLayout><div className="p-8 text-center text-muted-foreground">Loading profile...</div></MentorLayout>;
  }

  return (
    <MentorLayout>
      <div className="p-6 md:p-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-1">Edit Profile</h1>
        <p className="text-muted-foreground mb-6">Update your comprehensive mentor profile</p>

        <Tabs defaultValue="basic">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          {/* Basic Info */}
          <TabsContent value="basic">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Basic Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  {profileImage ? (
                    <img src={profileImage} alt="" className="w-20 h-20 rounded-full object-cover" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">{initials}</div>
                  )}
                  <div>
                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}><Upload className="h-3 w-3 mr-1" />Upload Photo</Button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                    <p className="text-xs text-muted-foreground mt-1">JPG or PNG, max 2MB</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Full Name *</label><Input value={fullName} onChange={e => setFullName(e.target.value)} /></div>
                  <div><label className="block text-sm font-medium mb-1">Location</label><Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Mumbai, India" /></div>
                </div>
                <div><label className="block text-sm font-medium mb-1">Professional Headline *</label><Input value={headline} onChange={e => setHeadline(e.target.value)} /></div>
                <div><label className="block text-sm font-medium mb-1">Bio *</label><Textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} placeholder="Tell learners about your expertise..." /></div>
                <div>
                  <label className="block text-sm font-medium mb-2">Languages</label>
                  <div className="flex gap-2 mb-2">
                    <Input placeholder="Add language" value={newLanguage} onChange={e => setNewLanguage(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (newLanguage && !languages.includes(newLanguage)) { setLanguages([...languages, newLanguage]); setNewLanguage(''); } } }} />
                    <Button type="button" onClick={() => { if (newLanguage && !languages.includes(newLanguage)) { setLanguages([...languages, newLanguage]); setNewLanguage(''); } }} disabled={!newLanguage}><Plus className="h-4 w-4" /></Button>
                  </div>
                  <div className="flex flex-wrap gap-2">{languages.map(l => <Badge key={l} variant="secondary" className="cursor-pointer" onClick={() => setLanguages(languages.filter(x => x !== l))}><LanguagesIcon className="h-3 w-3 mr-1" />{l}<X className="h-3 w-3 ml-1" /></Badge>)}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional */}
          <TabsContent value="professional">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5" />Professional Information</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Skills & Expertise *</label>
                  <div className="flex gap-2 mb-2">
                    <Input placeholder="Add skill" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (newSkill && !skillsData[newSkill]) { setSkillsData({ ...skillsData, [newSkill]: 'intermediate' }); setNewSkill(''); } } }} />
                    <Button type="button" onClick={() => { if (newSkill && !skillsData[newSkill]) { setSkillsData({ ...skillsData, [newSkill]: 'intermediate' }); setNewSkill(''); } }} disabled={!newSkill}><Plus className="h-4 w-4" /></Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {commonSkills.map(s => (
                      <Badge key={s} variant={skillsData[s] ? 'default' : 'outline'} className="cursor-pointer" onClick={() => { if (skillsData[s]) { const n = { ...skillsData }; delete n[s]; setSkillsData(n); } else { setSkillsData({ ...skillsData, [s]: 'intermediate' }); } }}>
                        {skillsData[s] && <CheckCircle className="h-3 w-3 mr-1" />}{s}
                      </Badge>
                    ))}
                  </div>
                  {Object.keys(skillsData).length > 0 && (
                    <div className="space-y-2">
                      {Object.entries(skillsData).map(([skill, level]) => (
                        <div key={skill} className="flex items-center gap-2">
                          <span className="text-sm font-medium min-w-[120px]">{skill}</span>
                          <Select value={level} onValueChange={v => setSkillsData({ ...skillsData, [skill]: v })}>
                            <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                            <SelectContent>{skillLevels.map(l => <SelectItem key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</SelectItem>)}</SelectContent>
                          </Select>
                          <Button type="button" variant="ghost" size="sm" onClick={() => { const n = { ...skillsData }; delete n[skill]; setSkillsData(n); }}><X className="h-4 w-4" /></Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Experience Years *</label><Input type="number" value={experienceYears} onChange={e => setExperienceYears(Number(e.target.value))} /></div>
                  <div><label className="block text-sm font-medium mb-1">Job Role</label><Input value={jobRole} onChange={e => setJobRole(e.target.value)} placeholder="Senior Software Engineer" /></div>
                </div>
                <div><label className="block text-sm font-medium mb-1">Current Company</label><Input value={currentCompany} onChange={e => setCurrentCompany(e.target.value)} placeholder="Google" /></div>

                {/* Past Experience */}
                <div>
                  <label className="block text-sm font-medium mb-2">Past Experience</label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <Input placeholder="Company" value={newPastExp.company} onChange={e => setNewPastExp({ ...newPastExp, company: e.target.value })} />
                    <Input placeholder="Role" value={newPastExp.role} onChange={e => setNewPastExp({ ...newPastExp, role: e.target.value })} />
                    <Input placeholder="Years" value={newPastExp.years} onChange={e => setNewPastExp({ ...newPastExp, years: e.target.value })} />
                  </div>
                  <Button type="button" size="sm" onClick={() => { if (newPastExp.company && newPastExp.role) { setPastExperience([...pastExperience, newPastExp]); setNewPastExp({ company: '', role: '', years: '' }); } }} disabled={!newPastExp.company || !newPastExp.role}><Plus className="h-4 w-4 mr-1" />Add</Button>
                  {pastExperience.map((exp, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border mt-2">
                      <div><p className="text-sm font-medium">{exp.role} at {exp.company}</p><p className="text-xs text-muted-foreground">{exp.years}</p></div>
                      <Button variant="ghost" size="sm" onClick={() => setPastExperience(pastExperience.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>

                {/* Education */}
                <div>
                  <label className="block text-sm font-medium mb-2">Education</label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <Input placeholder="Degree" value={newEdu.degree} onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })} />
                    <Input placeholder="Institution" value={newEdu.institution} onChange={e => setNewEdu({ ...newEdu, institution: e.target.value })} />
                    <Input type="number" placeholder="Year" value={newEdu.year} onChange={e => setNewEdu({ ...newEdu, year: parseInt(e.target.value) || new Date().getFullYear() })} />
                  </div>
                  <Button type="button" size="sm" onClick={() => { if (newEdu.degree && newEdu.institution) { setEducation([...education, newEdu]); setNewEdu({ degree: '', institution: '', year: new Date().getFullYear() }); } }} disabled={!newEdu.degree || !newEdu.institution}><Plus className="h-4 w-4 mr-1" />Add</Button>
                  {education.map((edu, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border mt-2">
                      <div><p className="text-sm font-medium">{edu.degree}</p><p className="text-xs text-muted-foreground">{edu.institution} · {edu.year}</p></div>
                      <Button variant="ghost" size="sm" onClick={() => setEducation(education.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing */}
          <TabsContent value="pricing">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5" />Pricing & Packages</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Hourly Rate (₹) *</label><Input type="number" value={hourlyRate} onChange={e => setHourlyRate(Number(e.target.value))} /></div>
                  <div><label className="block text-sm font-medium mb-1">Currency</label>
                    <Select value={currency} onValueChange={setCurrency}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                      <SelectItem value="INR">INR (₹)</SelectItem><SelectItem value="USD">USD ($)</SelectItem><SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent></Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="freeConsult" checked={freeConsultation} onCheckedChange={c => setFreeConsultation(c as boolean)} />
                  <label htmlFor="freeConsult" className="text-sm font-medium">Offer free consultation</label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Package Deals</label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <Input type="number" placeholder="Sessions" value={newPkg.sessions || ''} onChange={e => setNewPkg({ ...newPkg, sessions: parseInt(e.target.value) || 0 })} />
                    <Input type="number" placeholder="Price" value={newPkg.price || ''} onChange={e => setNewPkg({ ...newPkg, price: parseInt(e.target.value) || 0 })} />
                    <Input type="number" placeholder="Savings" value={newPkg.savings || ''} onChange={e => setNewPkg({ ...newPkg, savings: parseInt(e.target.value) || 0 })} />
                  </div>
                  <Button type="button" size="sm" onClick={() => { if (newPkg.sessions > 0 && newPkg.price > 0) { setPackageDeals([...packageDeals, newPkg]); setNewPkg({ sessions: 0, price: 0, savings: 0 }); } }}><Plus className="h-4 w-4 mr-1" />Add Package</Button>
                  {packageDeals.map((pkg, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border mt-2">
                      <div><p className="text-sm font-medium">{pkg.sessions} Sessions - ₹{pkg.price}</p><p className="text-xs text-accent">Save ₹{pkg.savings}</p></div>
                      <Button variant="ghost" size="sm" onClick={() => setPackageDeals(packageDeals.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">You receive 80% after platform fee</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Availability */}
          <TabsContent value="availability">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Availability</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Time Zone</label>
                    <Select value={timeZone} onValueChange={setTimeZone}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{timeZones.map(tz => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}</SelectContent></Select>
                  </div>
                  <div><label className="block text-sm font-medium mb-1">Response Time</label><Input value={responseTime} onChange={e => setResponseTime(e.target.value)} placeholder="Within 2 hours" /></div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Weekly Schedule</label>
                  {Object.keys(weeklySchedule).map(day => (
                    <div key={day} className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium capitalize w-24">{day}:</span>
                      <Input placeholder="e.g. 9:00-12:00, 14:00-18:00" value={weeklySchedule[day]?.join(', ') || ''}
                        onChange={e => setWeeklySchedule({ ...weeklySchedule, [day]: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time Off</label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <Input type="date" value={newTimeOff.start} onChange={e => setNewTimeOff({ ...newTimeOff, start: e.target.value })} />
                    <Input type="date" value={newTimeOff.end} onChange={e => setNewTimeOff({ ...newTimeOff, end: e.target.value })} />
                    <Input placeholder="Reason" value={newTimeOff.reason} onChange={e => setNewTimeOff({ ...newTimeOff, reason: e.target.value })} />
                  </div>
                  <Button type="button" size="sm" onClick={() => { if (newTimeOff.start && newTimeOff.end) { setTimeOff([...timeOff, newTimeOff]); setNewTimeOff({ start: '', end: '', reason: '' }); } }}><Plus className="h-4 w-4 mr-1" />Add Time Off</Button>
                  {timeOff.map((t, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border mt-2">
                      <div><p className="text-sm font-medium">{t.reason}</p><p className="text-xs text-muted-foreground">{t.start} to {t.end}</p></div>
                      <Button variant="ghost" size="sm" onClick={() => setTimeOff(timeOff.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verification */}
          <TabsContent value="verification">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" />Verification & Credentials</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Certifications</label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <Input placeholder="Name" value={newCert.name} onChange={e => setNewCert({ ...newCert, name: e.target.value })} />
                    <Input placeholder="Issuer" value={newCert.issuer} onChange={e => setNewCert({ ...newCert, issuer: e.target.value })} />
                    <Input type="number" placeholder="Year" value={newCert.year} onChange={e => setNewCert({ ...newCert, year: parseInt(e.target.value) || new Date().getFullYear() })} />
                  </div>
                  <Button type="button" size="sm" onClick={() => { if (newCert.name && newCert.issuer) { setCertifications([...certifications, newCert]); setNewCert({ name: '', issuer: '', year: new Date().getFullYear() }); } }}><Plus className="h-4 w-4 mr-1" />Add</Button>
                  {certifications.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border mt-2">
                      <div><p className="text-sm font-medium">{c.name}</p><p className="text-xs text-muted-foreground">{c.issuer} · {c.year}</p></div>
                      <Button variant="ghost" size="sm" onClick={() => setCertifications(certifications.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">ID Document URL</label><Input value={idDocument} onChange={e => setIdDocument(e.target.value)} placeholder="Government ID" /></div>
                  <div><label className="block text-sm font-medium mb-1">Work Verification URL</label><Input value={workVerification} onChange={e => setWorkVerification(e.target.value)} placeholder="Employment proof" /></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics */}
          <TabsContent value="statistics">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Statistics (Auto-calculated)</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Total Sessions', value: (mentorProfile as any)?.sessions_completed || 0 },
                    { label: 'Total Students', value: (mentorProfile as any)?.total_students || 0 },
                    { label: 'Average Rating', value: (mentorProfile as any)?.rating || '-' },
                    { label: 'Total Reviews', value: (mentorProfile as any)?.review_count || 0 },
                    { label: 'Response Rate', value: '0%' },
                    { label: 'Completion Rate', value: '0%' },
                  ].map(stat => (
                    <div key={stat.label} className="p-4 rounded-lg bg-secondary">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-primary"><strong>Note:</strong> Statistics update automatically as you complete sessions.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 mt-8">
          <Button onClick={handleSave} disabled={isLoading}><Save className="h-4 w-4 mr-1" />{isLoading ? 'Saving...' : 'Save Changes'}</Button>
          <Button variant="outline" onClick={() => navigate('/mentor/dashboard')} disabled={isLoading}>Cancel</Button>
        </div>
      </div>
    </MentorLayout>
  );
};

export default MentorProfileEdit;
