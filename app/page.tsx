import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { ProjectsSection } from "@/components/projects-section"
import { EducationSection } from "@/components/education-section"
import { ExperienceSection } from "@/components/experience-section"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { getSettings, getFeaturedProjects, getEducation, getExperience } from "@/lib/data"

export default async function Home() {
  const settings = await getSettings()
  const projects = await getFeaturedProjects()
  const education = await getEducation()
  const experience = await getExperience()

  const siteTitle = settings?.site_title || "My Portfolio"
  const siteDescription =
    settings?.site_description || "Showcasing my best work in design, development, and creative projects"
  const aboutText =
    settings?.about_text ||
    "I'm a passionate creative professional with expertise in design and development. With years of experience in the industry, I've worked on a variety of projects ranging from web design to brand identity.\n\nMy approach combines technical skills with creative thinking to deliver solutions that are both functional and aesthetically pleasing."

  const socialLinks = {
    instagram: settings?.instagram_url,
    behance: settings?.behance_url,
    github: settings?.github_url,
    linkedin: settings?.linkedin_url,
    facebook: settings?.facebook_url,
    twitter: settings?.twitter_url,
    discord: settings?.discord_url,
    youtube: settings?.youtube_url,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header siteTitle={siteTitle} />

      <main className="flex-1">
        <HeroSection title={siteTitle} subtitle={siteDescription} />
        <ProjectsSection projects={projects} />
        <ExperienceSection experience={experience} />
        <EducationSection education={education} />
        <AboutSection aboutText={aboutText} profileImageUrl={settings?.profile_image_url} />
        <ContactSection />
      </main>

      <Footer siteTitle={siteTitle} siteDescription={siteDescription} socialLinks={socialLinks} />
    </div>
  )
}

