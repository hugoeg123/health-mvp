# Project Structure

This document outlines the recommended project structure for better organization and maintainability.

```
client/
└── src/
    ├── features/           # Feature-based modules (auth, appointments, profiles)
    │   ├── auth/           # Authentication related components and logic
    │   ├── appointments/   # Appointment management
    │   └── profiles/       # User profiles management
    ├── layouts/           # Page layouts and layout components
    │   ├── MainLayout/    # Main application layout
    │   └── AuthLayout/    # Authentication pages layout
    ├── routes/            # Route configurations and guards
    ├── components/        # Shared/common components
    │   ├── ui/           # Basic UI components (buttons, inputs)
    │   └── common/       # Complex shared components
    ├── hooks/            # Custom React hooks
    ├── services/         # API services and external integrations
    ├── utils/            # Utility functions and helpers
    ├── types/            # TypeScript type definitions
    ├── constants/        # Application constants
    └── assets/           # Static assets (images, icons)
```

## Benefits of this Structure

1. **Feature-based Organization**: Groups related code by feature/domain, making it easier to manage and scale.
2. **Clear Separation**: Separates UI components, business logic, and data access.
3. **Reusability**: Common components and utilities are easily accessible.
4. **Maintainability**: Clear organization makes it easier to find and update code.
5. **Scalability**: New features can be added without affecting existing ones.

## Guidelines

- Keep components small and focused
- Use index.ts files for clean exports
- Maintain consistent naming conventions
- Document complex logic and components
- Follow the principle of separation of concerns