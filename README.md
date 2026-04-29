# Loan Management System (LMS) - Professional & Graduate Learning Guide


A comprehensive, production-ready full-stack application designed to demonstrate enterprise-level software development practices. This project serves as an excellent reference for professionals and graduates looking to understand real-world application architecture, design patterns, and best practices.


## Learning Outcomes


By studying this project, you will gain insights into:


- **Enterprise Architecture**: Multi-tier application design (Frontend, Backend, Database)

- **Full-Stack Development**: Modern JavaScript/TypeScript across client and server

- **Authentication & Authorization**: JWT-based auth with Role-Based Access Control (RBAC)

- **Business Logic Implementation**: Complex workflows with state management

- **Database Design**: MongoDB schema design with relationships and validation

- **API Design**: RESTful endpoints following industry standards

- **DevOps Practices**: Environment management and deployment considerations


---


## Architecture Overview


### Technology Stack


| Layer | Technology | Purpose |

|-------|-----------|---------|

| **Frontend** | Next.js (App Router) | Modern React framework with built-in routing and optimization |

| **Backend** | Express.js + TypeScript | Type-safe Node.js server with middleware architecture |

| **Database** | MongoDB + Mongoose | NoSQL database with schema validation |

| **Authentication** | JWT + bcrypt | Secure token-based authentication |

| **Styling** | Tailwind CSS | Utility-first CSS framework |

| **Build Tools** | TypeScript, ESLint | Compile-time type checking and code quality |


### Project Structure


```

LMS_Assignment/

├── backend/                    # Express.js + TypeScript Backend

│   ├── src/

│   │   ├── app.ts             # Express app initialization

│   │   ├── server.ts          # Server entry point

│   │   ├── config/            # Configuration management

│   │   ├── controllers/       # Business logic handlers

│   │   ├── middlewares/       # Express middleware

│   │   ├── models/            # Mongoose schemas

│   │   ├── routes/            # API route definitions

│   │   └── utils/             # Helper utilities (BRE, calculations)

│   ├── seed.ts                # Database seeding script

│   └── package.json           # Backend dependencies

│

├── frontend/                   # Next.js Frontend

│   ├── src/

│   │   ├── app/               # Page components

│   │   ├── context/           # React Context for state

│   │   └── utils/             # API helpers

│   ├── public/                # Static assets

│   └── package.json           # Frontend dependencies

│

└── README.md                   # Project setup guide

```


---


## Security & Authentication Pattern


### JWT Flow


```

1. User Login → Credentials validated against database

2. JWT Token Generated → Contains user ID, role, and metadata

3. Token Stored → Browser localStorage (frontend)

4. Protected Routes → Middleware validates token on each request

5. Role-Based Access → Controller checks user role before action

```


### Implementation Details


**Backend Authentication ([authController.ts](backend/src/controllers/authController.ts))**:

- Password hashing with bcrypt (salting + hashing)

- JWT token generation with expiration

- Secure token validation on protected routes


**Role-Based Access Control ([authMiddleware.ts](backend/src/middlewares/authMiddleware.ts))**:

- Middleware verifies JWT signature

- Extracts user data from token payload

- Enforces role-based access on sensitive endpoints


---


## Core Features & Implementation


### 1. Multi-Step Application Form

**Pattern**: Stateful workflow with backend state management


- Borrower initiates loan application through step-by-step form

- Each step validates data before proceeding

- Backend tracks application status through state transitions

- Different roles (Sales, Sanction, Disbursement) interact with same application at different stages


**Learning**: How to handle complex user flows in frontend + manage state changes in backend


### 2. Business Rules Engine (BRE)

**Location**: [src/utils/bre.ts](backend/src/utils/bre.ts)


Implements eligibility filtering:

- Age validation (minimum age requirement)

- Salary-based loan eligibility

- Business rule centralization for maintainability


**Learning**: How to externalize business logic for testability and maintainability


### 3. Loan Calculations

**Pattern**: Simple Interest Formula


```

Simple Interest = (Principal × Rate × Time) / 100

Monthly EMI = (Principal + Interest) / Number of Months

```


**Learning**: Implementing financial calculations with precision and validation


### 4. Role-Based Dashboard

**Roles Implemented**:

- **Admin**: System management and user administration

- **Sales**: Lead generation and borrower onboarding

- **Sanction**: Loan approval decision making

- **Disbursement**: Fund release management

- **Collection**: Payment and recovery management

- **Borrower**: Application tracking and self-service portal


**Learning**: How to design systems that serve multiple user personas


---


## Backend Development Best Practices


### Model Design Pattern

**File**: [User.ts](backend/src/models/User.ts), [Loan.ts](backend/src/models/Loan.ts)


```typescript

// Mongoose Schema with validation

const userSchema = new Schema({

  email: { type: String, unique: true, required: true },

  password: { type: String, required: true },

  role: { type: String, enum: ['admin', 'sales', 'sanction', ...], required: true },

  // ...

});


// Pre-save hooks for data integrity

userSchema.pre('save', async function() {

  // Hash password before saving

});

```


**Best Practices Demonstrated**:

- Schema validation at model level

- Pre-save hooks for data transformation

- Unique constraints for data integrity

- Enum fields for type safety


### Controller Pattern

**File**: [authController.ts](backend/src/controllers/authController.ts)


```typescript

// Separation of concerns: Controllers handle HTTP

// Business logic separated into utils/services

export const login = async (req: Request, res: Response) => {

  // 1. Validate input

  // 2. Query database

  // 3. Execute business logic

  // 4. Return response

};

```


**Best Practices**:

- Single responsibility principle

- Error handling with try-catch

- HTTP status codes follow REST conventions

- Request validation before processing


### Middleware Pattern

**File**: [authMiddleware.ts](backend/src/middlewares/authMiddleware.ts)


```typescript

// Middleware for cross-cutting concerns

app.use(authMiddleware);  // Verify JWT on all requests

app.use(errorMiddleware); // Centralized error handling

```


**Best Practices**:

- Middleware chain for clean separation

- Error handling isolation

- Request enrichment (adding user data to request)


---


## Frontend Development Best Practices


### Context API for State Management

**File**: [AuthContext.tsx](frontend/src/context/AuthContext.tsx)


```typescript

// Global state for authentication

const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider: React.FC = ({ children }) => {

  const [user, setUser] = useState(null);

  const [token, setToken] = useState(localStorage.getItem('token'));

  

  return (

    <AuthContext.Provider value={{ user, token, login, logout }}>

      {children}

    </AuthContext.Provider>

  );

};

```


**Learning**: How to manage global state without Redux complexity


### Page-based Routing

**File Structure**: [src/app/](frontend/src/app/)


- Uses Next.js App Router (modern approach vs Pages Router)

- File-system based routing (files become routes automatically)

- Layout components for shared UI


**Best Practices**:

- Scalable routing structure

- SEO optimization built-in

- Code splitting per route


### API Abstraction Layer

**File**: [utils/api.ts](frontend/src/utils/api.ts)


```typescript

// Centralized API calls

const api = axios.create({

  baseURL: process.env.NEXT_PUBLIC_API_URL,

});


// Interceptors for common logic

api.interceptors.request.use((config) => {

  config.headers.Authorization = `Bearer ${getToken()}`;

  return config;

});

```


**Learning**: How to abstract HTTP logic for maintainability and reusability


---


## Database Design Patterns


### Schema Relationships


```

User

├── role: enum (determines permissions)

├── profile data


Loan

├── borrowerId: ObjectId (FK to User)

├── status: enum (workflow stages)

├── timeline: Array (audit trail)

└── calculations: Object (EMI, interest, etc.)

```


### Validation & Constraints


- **Field-level validation**: Required fields, data types

- **Business-level validation**: Complex rules (age + income eligibility)

- **Unique constraints**: Email addresses, application IDs

- **Enum restrictions**: Predefined allowed values for status fields


**Learning**: How to ensure data integrity at multiple layers


---


## API Design Patterns


### RESTful Conventions


```

POST   /api/auth/register      → Create new user

POST   /api/auth/login         → Authenticate user

GET    /api/borrower/loans     → List borrower's loans

GET    /api/borrower/loans/:id → Get specific loan details

PUT    /api/admin/loans/:id    → Update loan status

DELETE /api/admin/users/:id    → Remove user

```


### Response Format


```typescript

// Standardized response envelope

{

  success: boolean,

  data: T,

  error?: string,

  statusCode: number

}

```


**Learning**: Consistency in API design improves frontend integration


---


## Testing & Quality Assurance


### Code Quality Tools


- **TypeScript**: Compile-time type checking prevents runtime errors

- **ESLint**: Code style and best practice enforcement

- **Schema Validation**: Mongoose validates data structure


### Testing Considerations


Areas for comprehensive testing:

1. **Unit Tests**: BRE calculations, validation functions

2. **Integration Tests**: Controller + Model interactions

3. **E2E Tests**: Complete user workflows

4. **Auth Tests**: JWT validation, role-based access


---


## Deployment Considerations


### Environment Management


```env

# Backend .env

PORT=5000

MONGO_URI=mongodb://localhost:27017/lms_assignment

JWT_SECRET=your_secret_key

NODE_ENV=production

```


### Database Connection Pooling

**File**: [config/db.ts](backend/src/config/db.ts)


```typescript

// Connection pooling for production

mongoose.connect(process.env.MONGO_URI, {

  maxPoolSize: 10,

  minPoolSize: 5,

});

```


### Frontend Build Optimization

- Next.js automatic code splitting

- Image optimization with next/image

- CSS-in-JS for optimized stylesheets


---


## How to Use This Project for Learning


### For Understanding Architecture

1. Read the project structure overview

2. Study the [models](backend/src/models/) folder for data design

3. Review [routes](backend/src/routes/) for API organization


### For Learning Authentication

1. Examine [authController.ts](backend/src/controllers/authController.ts) for login flow

2. Study [authMiddleware.ts](backend/src/middlewares/authMiddleware.ts) for JWT validation

3. Review [AuthContext.tsx](frontend/src/context/AuthContext.tsx) for frontend integration


### For Learning Business Logic

1. Review [src/utils/bre.ts](backend/src/utils/bre.ts) for BRE implementation

2. Study loan calculation functions

3. Understand state transition logic in controllers


### For Learning Full-Stack Integration

1. Follow a complete user flow from frontend to backend

2. Trace API call from [utils/api.ts](frontend/src/utils/api.ts) through backend routes to database

3. Understand how state flows back through Context API


---


## Professional Tips


### 1. Code Organization

- Keep models separate from business logic

- Use middleware for cross-cutting concerns

- Centralize configuration management


### 2. Error Handling

- Implement centralized error middleware

- Use appropriate HTTP status codes

- Provide meaningful error messages


### 3. Security

- Hash passwords with bcrypt

- Validate all user inputs

- Use JWT for stateless authentication

- Implement CORS appropriately


### 4. Scalability

- Use database indexes for frequently queried fields

- Implement caching strategies

- Consider API rate limiting

- Plan for horizontal scaling


### 5. Documentation

- Maintain API documentation

- Document business rules clearly

- Include setup instructions

- Provide example requests/responses


---


## Real-World Lessons


| Concept | Implementation | Real-World Use |

|---------|----------------|----------------|

| RBAC | Middleware + Controller checks | Multi-tenant SaaS platforms |

| State Machine | Loan status workflow | Order management, HR systems |

| BRE | Eligibility checks | Insurance, lending, e-commerce |

| JWT Auth | Token-based access | Microservices, mobile apps |

| Document DB | MongoDB collections | Content management, flexible schemas |


---


## Contributing & Extending


### To Add New Features

1. Design data model (Mongoose schema)

2. Create controller logic

3. Implement routes

4. Add frontend pages and API calls

5. Test complete workflow


### To Improve Code Quality

1. Add comprehensive error handling

2. Implement input validation schemas

3. Add logging for debugging

4. Write unit tests for utilities

5. Document complex business logic


---


## Additional Resources


### Recommended Learning Paths


**Backend Developer**:

- Deepen: Express.js middleware patterns, MongoDB aggregation pipeline

- Security: Input validation, SQL/NoSQL injection prevention

- Performance: Database indexing, query optimization


**Frontend Developer**:

- Deepen: Next.js rendering strategies, React hooks optimization

- State: Advanced Context API patterns, Zustand/Recoil alternatives

- Performance: Code splitting, lazy loading, image optimization


**Full-Stack Developer**:

- Architecture: Microservices, event-driven design

- DevOps: Docker containerization, CI/CD pipelines

- Testing: Jest, Supertest for comprehensive coverage


---


## FAQ for Professionals


**Q: Why MongoDB over SQL?**

A: Document-based flexibility for evolving loan product features. Demonstrates NoSQL trade-offs in production.


**Q: How would you handle multiple loan applications?**

A: Extend Loan model with references, implement queue system, add background jobs for processing.


**Q: How to scale this to 1M users?**

A: Database sharding, caching layer (Redis), load balancing, microservices separation.


**Q: What about API versioning?**

A: Implement `/api/v1/` routes, plan migration path, maintain backward compatibility.


---


## Testing with Sample Data


### Pre-seeded Test Users

The project includes sample users for testing all features and roles. These users are automatically created when you run the seed script.


### Test User Accounts - Complete Reference

Below are all available test accounts with their complete details:

```typescript
const users = [
    {
        name: 'Admin User',
        email: 'admin@lms.com',
        password: 'password123',
        role: 'Admin'
    },
    {
        name: 'Sales Executive',
        email: 'sales@lms.com',
        password: 'password123',
        role: 'Sales'
    },
    {
        name: 'Sanction Executive',
        email: 'sanction@lms.com',
        password: 'password123',
        role: 'Sanction'
    },
    {
        name: 'Disbursement Executive',
        email: 'disbursement@lms.com',
        password: 'password123',
        role: 'Disbursement'
    },
    {
        name: 'Collection Executive',
        email: 'collection@lms.com',
        password: 'password123',
        role: 'Collection'
    },
    {
        name: 'Test Borrower',
        email: 'borrower@lms.com',
        password: 'password123',
        role: 'Borrower',
        personalDetails: {
            pan: 'ABCDE1234F',
            dob: '1995-05-15',
            monthlySalary: 50000,
            employmentMode: 'Salaried'
        }
    }
];
```


### How to Seed the Database

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Ensure MongoDB is running locally or configure MONGO_URI in .env

3. Run the seed script:
   ```bash
   npx ts-node seed.ts
   ```

4. You should see: "Database Seeded Successfully"


### Quick Reference: Login Credentials for Testing

| User Role | Email | Password | Purpose |
|-----------|-------|----------|---------|
| Admin | admin@lms.com | password123 | Full system access, user management |
| Sales | sales@lms.com | password123 | Borrower onboarding, loan application creation |
| Sanction | sanction@lms.com | password123 | Loan approval/rejection decisions |
| Disbursement | disbursement@lms.com | password123 | Fund release and payment tracking |
| Collection | collection@lms.com | password123 | Payment collection and recovery |
| Borrower | borrower@lms.com | password123 | Application submission and tracking |


### Testing Each Role - Feature Overview

#### 1. Admin (admin@lms.com)
- Create and manage users
- Assign roles and permissions
- View system-wide reports
- Modify system configurations
- Access audit logs

#### 2. Sales Representative (sales@lms.com)
- Register new borrowers
- Create loan applications
- View customer details
- Track application progress
- Generate sales reports

#### 3. Sanction Officer (sanction@lms.com)
- Review pending applications
- Run business rules eligibility checks
- Approve or reject loan applications
- Set loan terms and conditions
- View sanction history

#### 4. Disbursement Officer (disbursement@lms.com)
- View approved loans
- Disburse funds to borrower accounts
- Track disbursement status
- Generate disbursement reports

#### 5. Collection Officer (collection@lms.com)
- Track loan payments
- Manage payment collections
- Monitor defaulters
- Send payment reminders
- Generate collection reports

#### 6. Borrower Portal (borrower@lms.com)
- Submit loan applications through step-by-step form
- View application status in real-time
- Calculate estimated EMI
- Download loan documents
- View disbursement status


### Complete Testing Workflows

#### Test Workflow 1: End-to-End Loan Application

1. Open http://localhost:3000
2. Click Register and sign up as a new borrower (or use borrower@lms.com)
3. Complete personal details:
   - PAN: ABCDE1234F
   - DOB: 1995-05-15
   - Monthly Salary: 50000
   - Employment Mode: Salaried

4. Submit loan application for:
   - Loan Amount: 500,000
   - Interest Rate: 12%
   - Tenure: 24 months
   - Expected EMI: ~22,708 per month

5. Logout and login as sales@lms.com
   - View newly submitted application
   - Verify all borrower details

6. Logout and login as sanction@lms.com
   - Review application
   - Check eligibility (age, salary requirements)
   - Approve loan

7. Logout and login as disbursement@lms.com
   - View approved loan
   - Process disbursement
   - Confirm fund transfer

8. Logout and login as borrower@lms.com
   - View updated application status
   - See disbursement confirmation
   - Download loan agreement


#### Test Workflow 2: Role-Based Access Control Verification

1. Login as borrower@lms.com
   - Should only see: Dashboard, My Applications, Profile
   - Should NOT see: Admin panel, user management

2. Login as sales@lms.com
   - Should see: Dashboard, All Applications, New Borrower Registration
   - Should NOT see: Sanction options, disbursement functions

3. Login as sanction@lms.com
   - Should see: Pending Applications, Approve/Reject buttons
   - Should NOT see: Borrower list management, disbursement

4. Login as admin@lms.com
   - Should see: ALL features
   - Can create users, modify settings, view reports


#### Test Workflow 3: Business Rules Engine (BRE) Testing

Test case: Verify age and salary eligibility

1. Create new borrower application with:
   - Age: 21 years (minimum required)
   - Monthly Salary: 20000
   - Loan Request: 200000

2. Login as sanction@lms.com
   - Application should PASS eligibility
   - Loan can be approved

3. Create another application with:
   - Age: 18 years (below minimum)
   - Monthly Salary: 100000
   - Loan Request: 500000

4. Sanction officer should see eligibility FAILURE message
   - Application marked ineligible
   - Cannot approve loan


#### Test Workflow 4: Loan Calculation Verification

Using Borrower account (borrower@lms.com):

1. Submit loan application:
   - Principal (Loan Amount): 500,000
   - Interest Rate: 12% per annum
   - Tenure: 24 months

2. Verify calculations:
   - Total Interest = (500,000 × 12 × 2) / 100 = 120,000
   - Total Amount = 500,000 + 120,000 = 620,000
   - Monthly EMI = 620,000 / 24 = 25,833.33

3. System should display EMI details:
   - Principal portion per month
   - Interest portion per month
   - Total payment schedule


### Sample Test Data Suggestions

For comprehensive testing, create multiple borrower accounts:

```typescript
// Test Account 1: Salaried Employee (Eligible)
{
    name: 'Rajesh Kumar',
    email: 'rajesh@test.com',
    password: 'password123',
    personalDetails: {
        pan: 'ABCDE1234F',
        dob: '1992-03-20',
        monthlySalary: 75000,
        employmentMode: 'Salaried'
    }
}

// Test Account 2: Self-Employed (Check Eligibility)
{
    name: 'Priya Singh',
    email: 'priya@test.com',
    password: 'password123',
    personalDetails: {
        pan: 'FGHIJ5678K',
        dob: '1988-07-10',
        monthlySalary: 120000,
        employmentMode: 'Self-Employed'
    }
}

// Test Account 3: Contract Employee (Low Salary)
{
    name: 'Amit Patel',
    email: 'amit@test.com',
    password: 'password123',
    personalDetails: {
        pan: 'KLMNO9101P',
        dob: '2000-11-05',
        monthlySalary: 18000,
        employmentMode: 'Contract'
    }
}
```


### Testing Checklist

Before deployment, verify:

- [ ] Borrower can register and complete profile
- [ ] Borrower can submit multi-step loan application
- [ ] Sales officer can view all applications
- [ ] Sanction officer receives eligibility results
- [ ] Sanction officer can approve/reject loans
- [ ] Disbursement officer can process approved loans
- [ ] Collection officer can track payments
- [ ] Admin can create and manage users
- [ ] Role-based dashboards display correctly
- [ ] EMI calculations are accurate
- [ ] Age and salary eligibility rules work
- [ ] Unauthorized access is blocked
- [ ] All status transitions work correctly


### Troubleshooting Test Issues

If seeding fails:
```bash
# Verify MongoDB is running
mongosh

# Check connection string in .env
MONGO_URI=mongodb://127.0.0.1:27017/lms_assignment

# Clear database and reseed
npx ts-node seed.ts
```

If credentials don't work:
1. Verify seed script ran successfully
2. Check MongoDB collections for users
3. Ensure frontend and backend are both running
4. Clear browser localStorage and try again

---


## License & Attribution


This project is designed as a learning resource for professionals and graduates. Feel free to use, modify, and learn from it in your professional journey.


---


**Happy Learning!**


For complete architecture and best practices, see [PROFESSIONALS_AND_GRADUATES.md](PROFESSIONALS_AND_GRADUATES.md)


