import { Request, Response, NextFunction } from 'express'
import { validationResult, ValidationChain } from 'express-validator'

/**
 * Middleware to validate request data using express-validator
 * @param validations Array of validation chains to apply
 * @returns Middleware function that runs validations and handles errors
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Execute all validations
    await Promise.all(validations.map((validation) => validation.run(req)))

    // Get validation results
    const errors = validationResult(req)

    // If no errors, continue
    if (errors.isEmpty()) {
      return next()
    }

    // Return validation errors
    return res.status(400).json({
      error: 'Validation Error',
      details: errors.array(),
    })
  }
}
