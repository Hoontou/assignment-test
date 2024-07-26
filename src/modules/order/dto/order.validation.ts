import { body, param } from 'express-validator';
import { handleValidationError } from '../../../common/custom-errors';

export const validateCreateOrder = [
  body('userId')
    .isInt({ min: 1 })
    .notEmpty()
    .withMessage('User ID must be an integer and not empty'),
  body('amount')
    .isInt({ min: 1 })
    .notEmpty()
    .withMessage('Amount must be at least 1 and not empty'),
  body('name')
    .isString()
    .notEmpty()
    .withMessage('Name must be a string and not empty'),
  body('expire')
    .isInt({ min: 1 })
    .notEmpty()
    .withMessage('Expire must be at least 1 and not empty'),
  handleValidationError,
];

export const validateGetOrderById = [
  param('id')
    .isInt({ min: 1 })
    .notEmpty()
    .withMessage('ID parameter must be a positive integer'),
  handleValidationError,
];
