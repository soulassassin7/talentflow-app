import { db } from './dexie';
import { nanoid } from 'nanoid';
import type { Assessment, Question } from '../types'; 


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


type TemplateQuestion = Omit<Question, 'id' | 'condition'> & {
  condition?: {
    questionLabel: string;
    value: string;
  }
};

const ASSESSMENT_TEMPLATES: {
  jobTitle: string;
  assessmentTitle: string;
  sections: { title: string; questions: TemplateQuestion[] }[]
}[] = [
  {
    jobTitle: "Senior Frontend Engineer (React)",
    assessmentTitle: "React & Frontend Skills Assessment",
    sections: [
      {
        title: "Experience & Background",
        questions: [
          {
            label: "How many years of professional React experience do you have?",
            type: 'numeric',
            required: true,
            min: 0,
            max: 20
          },
          {
            label: "How many years of total frontend development experience do you have?",
            type: 'numeric',
            required: true,
            min: 0,
            max: 25
          },
          {
            label: "What is your current employment status?",
            type: 'single-choice',
            required: true,
            options: [
              { value: 'Employed' }, 
              { value: 'Unemployed' }, 
              { value: 'Freelancing' }, 
              { value: 'Student' }
            ]
          },
          {
            label: "Are you open to relocation?",
            type: 'single-choice',
            required: true,
            options: [{ value: 'Yes' }, { value: 'No' }, { value: 'Maybe' }]
          }
        ]
      },
      {
        title: "React Core Concepts",
        questions: [
          {
            label: "Which hook is used to perform side effects in a function component?",
            type: 'single-choice',
            required: true,
            options: [{ value: 'useState' }, { value: 'useEffect' }, { value: 'useContext' }, { value: 'useReducer' }]
          },
          {
            label: "What are the key differences between controlled and uncontrolled components?",
            type: 'long-text',
            required: true
          },
          {
            label: "Which of the following are valid ways to optimize React performance? (Select all that apply)",
            type: 'multi-choice',
            required: true,
            options: [
              { value: 'React.memo' }, 
              { value: 'useMemo' }, 
              { value: 'useCallback' }, 
              { value: 'PureComponent' },
              { value: 'shouldComponentUpdate' },
              { value: 'Virtual DOM diffing' }
            ]
          },
          {
            label: "Explain the concept of lifting state up in React.",
            type: 'long-text',
            required: true
          }
        ]
      },
      {
        title: "TypeScript & Modern JavaScript",
        questions: [
          {
            label: "Are you comfortable with TypeScript?",
            type: 'single-choice',
            required: true,
            options: [{ value: 'Yes' }, { value: 'No' }]
          },
          {
            label: "If yes, please rate your TypeScript proficiency from 1 (Beginner) to 5 (Expert).",
            type: 'numeric',
            required: false,
            min: 1,
            max: 5,
            condition: { questionLabel: "Are you comfortable with TypeScript?", value: 'Yes' }
          },
          {
            label: "Which ES6+ features do you use regularly? (Select all that apply)",
            type: 'multi-choice',
            required: true,
            options: [
              { value: 'Arrow functions' },
              { value: 'Destructuring' },
              { value: 'Template literals' },
              { value: 'Async/Await' },
              { value: 'Optional chaining' },
              { value: 'Nullish coalescing' }
            ]
          }
        ]
      },
      {
        title: "State Management & Architecture",
        questions: [
          {
            label: "Which state management libraries have you used in production? (Select all that apply)",
            type: 'multi-choice',
            required: true,
            options: [
              { value: 'Redux' },
              { value: 'MobX' },
              { value: 'Context API' },
              { value: 'Zustand' },
              { value: 'Recoil' },
              { value: 'Jotai' },
              { value: 'Valtio' }
            ]
          },
          {
            label: "Describe your approach to structuring a large-scale React application.",
            type: 'long-text',
            required: true
          }
        ]
      },
      {
        title: "Testing & Quality",
        questions: [
          {
            label: "What testing frameworks/libraries have you used for React? (Select all that apply)",
            type: 'multi-choice',
            required: true,
            options: [
              { value: 'Jest' },
              { value: 'React Testing Library' },
              { value: 'Enzyme' },
              { value: 'Cypress' },
              { value: 'Playwright' },
              { value: 'Vitest' }
            ]
          },
          {
            label: "What is your target test coverage percentage for frontend code?",
            type: 'numeric',
            required: true,
            min: 0,
            max: 100
          }
        ]
      },
      {
        title: "Practical Experience",
        questions: [
          {
            label: "Describe a time you had to optimize a slow React component. What was the problem and how did you solve it?",
            type: 'long-text',
            required: true
          },
          {
            label: "Have you implemented server-side rendering (SSR) or static site generation (SSG)?",
            type: 'single-choice',
            required: true,
            options: [{ value: 'Yes' }, { value: 'No' }]
          },
          {
            label: "If yes, which frameworks have you used for SSR/SSG?",
            type: 'short-text',
            required: false,
            condition: { questionLabel: "Have you implemented server-side rendering (SSR) or static site generation (SSG)?", value: 'Yes' }
          },
          {
            label: "Please provide a link to your GitHub profile or portfolio.",
            type: 'short-text',
            required: false
          }
        ]
      }
    ]
  },
  {
    jobTitle: "UX/UI Designer",
    assessmentTitle: "Design Skills & Process Review",
    sections: [
      {
        title: "Background & Experience",
        questions: [
          {
            label: "How many years of professional design experience do you have?",
            type: 'numeric',
            required: true,
            min: 0,
            max: 30
          },
          {
            label: "What type of design work do you specialize in? (Select all that apply)",
            type: 'multi-choice',
            required: true,
            options: [
              { value: 'Web Design' },
              { value: 'Mobile Design' },
              { value: 'Product Design' },
              { value: 'Visual/Graphic Design' },
              { value: 'Interaction Design' },
              { value: 'Service Design' }
            ]
          },
          {
            label: "Do you have formal design education?",
            type: 'single-choice',
            required: true,
            options: [
              { value: 'Bachelor\'s in Design' },
              { value: 'Master\'s in Design' },
              { value: 'Bootcamp/Course Certificate' },
              { value: 'Self-taught' }
            ]
          }
        ]
      },
      {
        title: "Design Tools & Technical Skills",
        questions: [
          {
            label: "Which design tools are you proficient in? (Select all that apply)",
            type: 'multi-choice',
            required: true,
            options: [
              { value: 'Figma' }, 
              { value: 'Sketch' }, 
              { value: 'Adobe XD' }, 
              { value: 'InVision' },
              { value: 'Framer' },
              { value: 'Principle' },
              { value: 'Adobe Creative Suite' },
              { value: 'Miro/FigJam' }
            ]
          },
          {
            label: "Rate your proficiency with Figma from 1 (Beginner) to 5 (Expert).",
            type: 'numeric',
            required: true,
            min: 1,
            max: 5
          },
          {
            label: "Do you have experience with design systems?",
            type: 'single-choice',
            required: true,
            options: [{ value: 'Yes' }, { value: 'No' }]
          },
          {
            label: "If yes, describe a design system you've created or contributed to.",
            type: 'long-text',
            required: false,
            condition: { questionLabel: "Do you have experience with design systems?", value: 'Yes' }
          }
        ]
      },
      {
        title: "Design Process & Methodology",
        questions: [
          {
            label: "Briefly describe your approach to user research.",
            type: 'long-text',
            required: true
          },
          {
            label: "Which research methods have you used? (Select all that apply)",
            type: 'multi-choice',
            required: true,
            options: [
              { value: 'User Interviews' },
              { value: 'Surveys' },
              { value: 'Usability Testing' },
              { value: 'A/B Testing' },
              { value: 'Card Sorting' },
              { value: 'Journey Mapping' },
              { value: 'Persona Development' }
            ]
          },
          {
            label: "How do you balance user needs with business requirements?",
            type: 'long-text',
            required: true
          },
          {
            label: "Walk us through your typical design process from brief to final handoff.",
            type: 'long-text',
            required: true
          }
        ]
      },
      {
        title: "Collaboration & Communication",
        questions: [
          {
            label: "How do you typically collaborate with developers?",
            type: 'long-text',
            required: true
          },
          {
            label: "Have you worked in an Agile/Scrum environment?",
            type: 'single-choice',
            required: true,
            options: [{ value: 'Yes' }, { value: 'No' }]
          },
          {
            label: "How do you handle design critique and feedback?",
            type: 'long-text',
            required: true
          }
        ]
      },
      {
        title: "Portfolio & Work Samples",
        questions: [
          {
            label: "Please provide a link to your portfolio.",
            type: 'short-text',
            required: true
          },
          {
            label: "Which project in your portfolio are you most proud of and why?",
            type: 'long-text',
            required: true
          },
          {
            label: "Do you have experience with accessibility standards (WCAG)?",
            type: 'single-choice',
            required: true,
            options: [
              { value: 'Expert level' },
              { value: 'Good understanding' },
              { value: 'Basic knowledge' },
              { value: 'No experience' }
            ]
          },
          {
            label: "Are you comfortable presenting design work to stakeholders?",
            type: 'single-choice',
            required: true,
            options: [{ value: 'Very comfortable' }, { value: 'Somewhat comfortable' }, { value: 'Not comfortable' }]
          }
        ]
      }
    ]
  },
  {
    jobTitle: "Lead Backend Developer (Node.js)",
    assessmentTitle: "Node.js & System Design Challenge",
    sections: [
      {
        title: "Experience & Background",
        questions: [
          {
            label: "How many years of professional backend development experience do you have?",
            type: 'numeric',
            required: true,
            min: 0,
            max: 25
          },
          {
            label: "How many years specifically with Node.js?",
            type: 'numeric',
            required: true,
            min: 0,
            max: 15
          },
          {
            label: "What size engineering teams have you worked with?",
            type: 'single-choice',
            required: true,
            options: [
              { value: '1-5 engineers' },
              { value: '6-20 engineers' },
              { value: '21-50 engineers' },
              { value: '50+ engineers' }
            ]
          }
        ]
      },
      {
        title: "Node.js Technical Knowledge",
        questions: [
          {
            label: "What is the Node.js event loop?",
            type: 'long-text',
            required: true
          },
          {
            label: "Explain the difference between process.nextTick() and setImmediate().",
            type: 'long-text',
            required: true
          },
          {
                        label: "Which Node.js frameworks have you used in production? (Select all that apply)",
            type: 'multi-choice',
            required: true,
            options: [
              { value: 'Express.js' },
              { value: 'Koa.js' },
              { value: 'Fastify' },
              { value: 'NestJS' },
              { value: 'Hapi' },
              { value: 'Restify' }
            ]
          }
        ]
      },
      {
        title: "Database & Architecture",
        questions: [
          {
            label: "Have you worked with microservices architecture?",
            type: 'single-choice',
            required: true,
            options: [{ value: 'Yes' }, { value: 'No' }]
          },
          {
            label: "If yes, please describe a challenge you faced with inter-service communication.",
            type: 'long-text',
            required: false,
            condition: { questionLabel: "Have you worked with microservices architecture?", value: 'Yes' }
          },
          {
            label: "Which databases have you worked with in production? (Select all that apply)",
            type: 'multi-choice',
            required: true,
            options: [
              { value: 'PostgreSQL' },
              { value: 'MySQL' },
              { value: 'MongoDB' },
              { value: 'Redis' },
              { value: 'DynamoDB' },
              { value: 'Cassandra' },
              { value: 'Elasticsearch' }
            ]
          },
          {
            label: "How do you approach database optimization and query performance?",
            type: 'long-text',
            required: true
          }
        ]
      },
      {
        title: "API Design & Security",
        questions: [
          {
            label: "Which API paradigms have you implemented? (Select all that apply)",
            type: 'multi-choice',
            required: true,
            options: [
              { value: 'REST' },
              { value: 'GraphQL' },
              { value: 'gRPC' },
              { value: 'WebSockets' },
              { value: 'Server-Sent Events' }
            ]
          },
          {
            label: "How do you handle authentication and authorization in your APIs?",
            type: 'long-text',
            required: true
          },
          {
            label: "Rate your experience with API security best practices from 1 (Beginner) to 5 (Expert).",
            type: 'numeric',
            required: true,
            min: 1,
            max: 5
          }
        ]
      },
      {
        title: "DevOps & Deployment",
        questions: [
          {
            label: "Which cloud platforms have you deployed Node.js applications to? (Select all that apply)",
            type: 'multi-choice',
            required: true,
            options: [
              { value: 'AWS' },
              { value: 'Google Cloud Platform' },
              { value: 'Microsoft Azure' },
              { value: 'Heroku' },
              { value: 'DigitalOcean' },
              { value: 'Vercel' }
            ]
          },
          {
            label: "Do you have experience with containerization (Docker/Kubernetes)?",
            type: 'single-choice',
            required: true,
            options: [{ value: 'Yes' }, { value: 'No' }]
          },
          {
            label: "Describe your approach to monitoring and logging in production environments.",
            type: 'long-text',
            required: true
          }
        ]
      },
      {
        title: "Leadership & Team Collaboration",
        questions: [
          {
            label: "Have you mentored junior developers?",
            type: 'single-choice',
            required: true,
            options: [{ value: 'Yes' }, { value: 'No' }]
          },
          {
            label: "If yes, describe your mentoring approach and a success story.",
            type: 'long-text',
            required: false,
            condition: { questionLabel: "Have you mentored junior developers?", value: 'Yes' }
          },
          {
            label: "How do you approach code reviews and maintaining code quality standards?",
            type: 'long-text',
            required: true
          },
          {
            label: "Describe a complex technical challenge you solved and the impact it had.",
            type: 'long-text',
            required: true
          }
        ]
      }
    ]
  }
];


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
    
    createdAt: Date.now() - i * 1000 * 3600 * 24, 
    summary: jobData.summary,
  }));
  await db.jobs.bulkAdd(jobs);
  console.log(`Seeded ${jobs.length} jobs.`);

 
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
  console.log(`Seeded ${candidates.length} candidates.`);
  
 
  const assessmentsToSeed: Assessment[] = [];


jobs.forEach((job, index) => {
  
  const template = ASSESSMENT_TEMPLATES[index % ASSESSMENT_TEMPLATES.length];
  
  const allQuestionsForThisAssessment: Question[] = [];
  const sections = template.sections.map(section => {
    const questions: Question[] = section.questions.map(q => ({ ...q, id: nanoid() } as Question));
    allQuestionsForThisAssessment.push(...questions);
    return {
      id: nanoid(),
      title: section.title,
      questions: questions
    };
  });

  
  sections.forEach(section => {
    section.questions.forEach(q => {
      const templateQuestion = template.sections
        .flatMap(s => s.questions)
        .find(tq => tq.label === q.label);
      
      if (templateQuestion?.condition?.questionLabel) {
        const targetQuestion = allQuestionsForThisAssessment.find(aq => aq.label === templateQuestion.condition?.questionLabel);
        if (targetQuestion) {
          q.condition = {
            questionId: targetQuestion.id,
            value: templateQuestion.condition.value
          };
        }
      }
    });
  });

  assessmentsToSeed.push({
    jobId: job.id,
    title: `${job.title} Assessment`, 
    sections: sections,
  });
});

if (assessmentsToSeed.length > 0) {
  await db.assessments.bulkAdd(assessmentsToSeed);
  console.log(`Seeded ${assessmentsToSeed.length} assessments.`);
}

console.log('Final intelligent seeding complete.');
}