import { db } from './dexie';
import { nanoid } from 'nanoid';


const FIRST_NAMES = [
  "Aisha", "Ben", "Chloe", "David", "Eva", "Frank", "Grace", "Henry", "Isla", "Jack",
  "Kara", "Leo", "Mia", "Noah", "Olivia", "Paul", "Quinn", "Ruby", "Sam", "Tara",
  "Umar", "Violet", "Will", "Xena", "Yara", "Zayn", "Liam", "Emma", "Sophia", "James",
  "Lucas", "Ava", "Mason", "Zoe", "Ethan", "Lily", "Elijah", "Hannah", "Logan", "Nora"
];

const LAST_NAMES = [
  "Khan", "Smith", "Chen", "Williams", "Garcia", "Jones", "Rodriguez", "Lee", "Patel", "Brown",
  "Miller", "Davis", "Wilson", "Taylor", "Clark", "Hall", "Allen", "Young", "Walker", "Scott",
  "Adams", "Baker", "Carter", "Evans", "Green", "Hill", "Jackson", "King", "Lewis", "Martin",
  "Moore", "Nelson", "Parker", "Roberts", "Turner", "White", "Harris", "Thompson", "Wright", "Cooper"
];


const JOB_DATA = [
    { title: "Senior Frontend Engineer (React)", tags: ['frontend', 'react'], summary: "Lead our frontend team in building next-generation user interfaces with React and TypeScript. You will be responsible for major architectural decisions, mentoring junior developers, and ensuring the performance and scalability of our web applications." },
    { title: "Lead Backend Developer (Node.js)", tags: ['backend', 'nodejs'], summary: "Design and implement robust, scalable backend services using Node.js, GraphQL, and microservices architecture. A deep understanding of database design, cloud deployment on AWS, and API security is essential for this role." },
    { title: "UX/UI Designer", tags: ['design'], summary: "Create intuitive, elegant, and beautiful user experiences across our entire suite of products. You will work from user research and wireframing through to high-fidelity mockups and prototyping. A strong portfolio is required." },
    { title: "Senior Product Manager", tags: ['management', 'product'], summary: "Own the product roadmap for our core platform. You will conduct market research, write detailed specifications, and work closely with engineering and design to deliver features that provide immense value to our users." },
    { title: "DevOps Specialist (Kubernetes)", tags: ['devops', 'cloud'], summary: "Automate our entire CI/CD pipeline and manage our containerized infrastructure on Kubernetes. Experience with Docker, Helm, Prometheus, and Terraform is highly valued for this critical role in our platform team." },
    { title: "QA Automation Engineer (Cypress)", tags: ['qa'], summary: "Develop and execute a comprehensive automated testing strategy to ensure the quality and reliability of our products. You will be writing end-to-end tests, building testing frameworks, and championing quality across the engineering org." },
    { title: "Junior Full Stack Developer", tags: ['frontend', 'backend'], summary: "Join our dynamic team as a versatile full-stack developer. You'll work with a modern stack including React, Node.js, and PostgreSQL, contributing to all parts of the product. This is a great opportunity to learn and grow." },
    { title: "Lead Data Scientist (Python/ML)", tags: ['data'], summary: "Analyze large, complex datasets to extract meaningful insights and build predictive models that drive key business decisions. A PhD or Master's in a quantitative field and proficiency in Python, SQL, and ML libraries is required." },
    { title: "Engineering Manager", tags: ['management'], summary: "Lead, mentor, and grow a team of talented software engineers. You will be responsible for ensuring timely project delivery, fostering a positive and collaborative team culture, and guiding the career development of your direct reports." },
    { title: "Cloud Infrastructure Engineer", tags: ['cloud', 'devops'], summary: "Architect, build, and manage secure, scalable, and cost-effective cloud environments on AWS and GCP. You will be responsible for our VPCs, IAM policies, and infrastructure-as-code practices." },
    { title: "Mobile Developer (React Native)", tags: ['mobile', 'frontend'], summary: "Develop and maintain our cross-platform mobile application using React Native. You will work to deliver a consistent and high-quality experience for both our iOS and Android users." },
    { title: "Technical Project Manager", tags: ['management'], summary: "Coordinate and manage complex, cross-functional technical projects from inception to completion. Strong organizational skills and the ability to communicate effectively with both technical and non-technical stakeholders are key." },
    { title: "Information Security Engineer", tags: ['security'], summary: "Protect our systems and customer data by designing and implementing security controls, performing vulnerability assessments, and responding to security incidents. A deep understanding of network and application security is required." },
    { title: "Senior Backend Engineer (Go)", tags: ['backend', 'golang'], summary: "Join our high-performance backend team to build critical services in Go. We value performance, concurrency, and robust error handling. Experience with gRPC and distributed systems is a major plus." },
    { title: "Mid-Level Frontend Developer (Vue.js)", tags: ['frontend', 'vuejs'], summary: "We are looking for a skilled Vue.js developer to help build and maintain our customer-facing dashboard. You should have a strong grasp of modern JavaScript, CSS, and component-based architecture." },
    { title: "Principal Product Designer", tags: ['design', 'management'], summary: "Set the vision for the user experience across the entire company. You will lead major design initiatives, mentor other designers, and represent the voice of the user at the highest levels of the organization." },
    { title: "Senior Site Reliability Engineer (SRE)", tags: ['devops', 'cloud'], summary: "Ensure our platform is reliable, scalable, and performant. You will be responsible for monitoring, SLOs/SLIs, incident management, and building automation to eliminate toil." },
    { title: "Database Administrator (PostgreSQL)", tags: ['backend', 'data'], summary: "Manage, optimize, and ensure the reliability of our mission-critical PostgreSQL database clusters. Responsibilities include performance tuning, backup and recovery, and schema management." },
    { title: "Android Developer (Kotlin)", tags: ['mobile', 'android'], summary: "Build and maintain our native Android application using Kotlin and the latest Android Jetpack libraries. A passion for mobile UX and performance is a must." },
    { title: "Data Engineer (Spark/ETL)", tags: ['data'], summary: "Design, build, and maintain our data pipelines and ETL processes using technologies like Apache Spark and Airflow. You will ensure data is clean, reliable, and available for our data science team." },
    { title: "Solutions Architect", tags: ['cloud', 'management'], summary: "Work with our enterprise customers to design and implement solutions on our platform. This role requires a strong technical background and excellent client-facing communication skills." },
    { title: "UX Researcher", tags: ['design'], summary: "Conduct qualitative and quantitative research to understand user behaviors, needs, and motivations. Your insights will directly shape the future of our product." },
    { title: "Technical Writer", tags: ['documentation'], summary: "Create clear, concise, and comprehensive documentation for our developer APIs and user-facing products. You will be a key part of making our products easy to use." },
    { title: "Lead QA Engineer", tags: ['qa', 'management'], summary: "Lead our QA team, define our testing strategy, and be the ultimate gatekeeper for product quality. This role requires both technical and leadership skills." },
    { title: "IT Support Specialist", tags: ['it'], summary: "Provide internal IT support to our growing team. Responsibilities include onboarding new employees, managing hardware and software, and troubleshooting network issues." },
    { title: "Digital Marketing Manager", tags: ['marketing'], summary: "Develop and execute our digital marketing campaigns across all channels, including SEO, SEM, and social media. A data-driven mindset is essential." },
    { title: "Content Marketing Strategist", tags: ['marketing', 'documentation'], summary: "Create compelling content, including blog posts, white papers, and case studies, to attract and engage our target audience. Excellent writing skills are a must." },
    { title: "Senior Security Analyst", tags: ['security'], summary: "Analyze and respond to security alerts, conduct threat hunting, and help mature our security operations center (SOC). Experience with SIEM and EDR tools is required." },
    { title: "Machine Learning Engineer", tags: ['data'], summary: "Design, build, and deploy machine learning models into production. You will work on a variety of projects, from recommendation engines to fraud detection systems." },
    { title: "Agile Coach / Scrum Master", tags: ['management'], summary: "Guide our engineering teams in Agile and Scrum best practices. You will facilitate ceremonies, remove impediments, and help teams continuously improve their processes." }
];

const CANDIDATE_PROFILES = {
  frontend: [
    "Experienced React developer with 5+ years building complex, scalable frontend applications. Deeply passionate about clean code, component architecture, and user experience.", 
    "A Vue.js enthusiast with a strong eye for UI/UX details and a proven track record of delivering pixel-perfect, responsive interfaces from Figma designs.", 
    "Junior frontend developer with a solid foundation in HTML, CSS, and modern TypeScript. A recent bootcamp graduate who is extremely eager to learn and contribute to a fast-paced team.",
    "Frontend specialist with expertise in performance optimization, reducing load times and improving Core Web Vitals for large-scale applications."
  ],
  backend: [
    "Senior backend engineer with over 8 years of expertise in Node.js, Go, and building highly available distributed systems. Strong background in database design, API security, and optimization.", 
    "Full-stack engineer with a strong backend focus, skilled in building and deploying scalable microservices on AWS using Docker and Kubernetes.", 
    "Mid-level developer with 3 years of experience in Python (Django/Flask) and a passion for creating clean, well-documented RESTful APIs.",
    "A pragmatic Java developer with experience in the Spring ecosystem, focused on writing reliable and maintainable enterprise-grade code."
  ],
  design: [
    "Creative and empathetic UX/UI designer with a focus on user-centered design principles. Highly skilled in Figma, Sketch, and conducting user research and usability testing.", 
    "Lead product designer with a stunning portfolio of successful mobile and web applications. An expert in bridging the gap between user needs and business goals.", 
    "Visual designer with a passion for branding, illustration, and creating beautiful, consistent, and accessible design systems from the ground up."
  ],
  qa: [
    "Detail-oriented QA professional with a passion for improving product quality through robust automation with Cypress and Playwright. Loves finding edge cases.", 
    "Senior QA analyst with deep experience in manual, exploratory, and performance testing for large-scale, complex enterprise applications.", 
    "A dedicated QA automation engineer with a background in setting up comprehensive testing frameworks from scratch in a CI/CD environment."
  ],
  devops: [
    "Certified AWS DevOps engineer with extensive experience in building and maintaining resilient, automated CI/CD pipelines using Jenkins, GitLab CI, and Terraform.", 
    "Senior Site Reliability Engineer (SRE) with a primary focus on observability (Prometheus, Grafana), automation, and leading blameless post-mortems for incident response.", 
    "Cloud infrastructure specialist with deep expertise in architecting and managing secure, cost-effective, and highly available environments in both AWS and GCP."
  ],
  management: [
    "Data-driven and user-obsessed product leader with a proven track record of launching and scaling successful B2B SaaS products from 0 to 1.", 
    "Empathetic engineering manager focused on fostering a culture of psychological safety, enabling career growth, and ensuring successful project delivery.",
    "A seasoned technical project manager with PMP and Scrum Master certifications, skilled in managing Agile teams and complex project timelines."
  ],
  mobile: [
    "Skilled native iOS developer with 4 years of experience building beautiful and performant applications using Swift and SwiftUI.", 
    "Cross-platform mobile engineer proficient in building and deploying applications for both iOS and Android using React Native."
  ],
  data: [
    "A Data Scientist with a PhD in Statistics and extensive experience in building and deploying machine learning models for prediction and classification.", 
    "Insightful data analyst who excels at turning complex, raw datasets into clear, actionable dashboards and reports using SQL and Tableau."
  ],
  cloud: [
    "Multi-cloud specialist with professional certifications in both AWS (Solutions Architect) and GCP (Cloud Engineer).", 
    "Infrastructure engineer who lives and breathes infrastructure-as-code, with deep expertise in Terraform and Ansible."
  ],
  security: [
      "Application security expert with a focus on threat modeling, code scanning (SAST/DAST), and penetration testing.",
      "A cybersecurity analyst skilled in incident response, forensics, and monitoring for threats in a cloud-native environment."
  ]
};




const generateSlug = (title: string): string => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};

export async function seedDB() {
  const jobsCount = await db.jobs.count();
  if (jobsCount > 0) {
    console.log('DB already seeded with professional data');
    return;
  }

  const stages = ['applied','screen','tech','offer','hired','rejected'] as const;

  const jobs = JOB_DATA.map((jobData, i) => ({
    id: nanoid(),
    title: jobData.title,
    slug: generateSlug(jobData.title),
    status: i % 5 === 0 ? 'archived' as const : 'active' as const,
    tags: jobData.tags,
    order: i + 1,
    createdAt: Date.now() - i * 1000 * 3600,
    summary: jobData.summary,
  }));
  await db.jobs.bulkAdd(jobs);

  const candidates = [];
  const generatedEmails = new Set<string>();

  for (let i = 0; i < 1000; i++) {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    
    const targetJob = jobs[Math.floor(Math.random() * jobs.length)];
    const primaryTag = targetJob.tags[0] as keyof typeof CANDIDATE_PROFILES;
  
    const relevantProfiles = CANDIDATE_PROFILES[primaryTag] || ["Generalist with experience in multiple areas."];
    
    const profileText = relevantProfiles[Math.floor(Math.random() * relevantProfiles.length)];
    
    let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`;
    let counter = 1;
    while (generatedEmails.has(email)) {
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${counter++}@gmail.com`;
    }
    generatedEmails.add(email);

    candidates.push({
      id: nanoid(),
      name: `${firstName} ${lastName}`,
      email: email,
      jobId: targetJob.id, 
      stage: stages[Math.floor(Math.random() * stages.length)],
      timeline: [],
      profile: profileText,
    });
  }
  await db.candidates.bulkAdd(candidates);
  
  console.log('Final intelligent seeding complete.');
}