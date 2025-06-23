import assert from 'node:assert'
import OAS    from '@superhero/oas'

export default
{
  ...assert,

  oasHeader(specification, component, header, message)
  {
    try
    {
      new OAS(specification).headers.conform(component, header)
    }
    catch(reason)
    {
      const error = new assert.AssertionError(
      {
        message  : message,
        actual   : header,
        expected : component,
        operator : 'oasHeader'
      })
  
      error.code  = 'E_ASSERTION_OAS_HEADER'
      error.cause = reason
      throw error
    }
  },

  oasParameter(specification, component, parameter, message)
  {
    try
    {
      new OAS(specification).parameters.conform(component, parameter)
    }
    catch(reason)
    {
      const error = new assert.AssertionError(
      {
        message  : message,
        actual   : parameter,
        expected : component,
        operator : 'oasParameter'
      })

      error.code  = 'E_ASSERTION_OAS_PARAMETER'
      error.cause = reason
      throw error
    }
  },

  oasRequestBody(specification, component, requestBody, message)
  {
    try
    {
      new OAS(specification).requestBodies.conform(component, requestBody)
    }
    catch(reason)
    {
      const error = new assert.AssertionError(
      {
        message  : message,
        actual   : requestBody,
        expected : component,
        operator : 'oasRequestBody'
      })

      error.code  = 'E_ASSERTION_OAS_REQUEST_BODY'
      error.cause = reason
      throw error
    }
  },

  oasResponse(specification, component, instance, message)
  {
    try
    {
      new OAS(specification).responses.conform(component, instance)
    }
    catch(reason)
    {
      const error = new assert.AssertionError(
      {
        message  : message,
        actual   : instance,
        expected : component,
        operator : 'oasResponse'
      })

      error.code  = 'E_ASSERTION_OAS_RESPONSE'
      error.cause = reason
      throw error
    }
  },

  oasSchema(specification, component, instance, message)
  {
    try
    {
      new OAS(specification).schemas.conform(component, instance)
    }
    catch(reason)
    {
      const error = new assert.AssertionError(
      {
        message  : message,
        actual   : instance,
        expected : component,
        operator : 'oasSchema'
      })

      error.code  = 'E_ASSERTION_OAS_SCHEMA'
      error.cause = reason
      throw error
    }
  },
  
  instanceof(value, type, message)
  {
    if(value instanceof type)
    {
      return true
    }

    const error = new assert.AssertionError(
    {
      message  : message,
      actual   : Object.prototype.toString.call(value),
      expected : Object.prototype.toString.call(type),
      operator : 'instanceof',
    })

    error.code = 'E_ASSERTION_INSTANCEOF'
    throw error
  },

  typeof(value, type, message)
  {
    if(typeof value === type)
    {
      return true
    }

    const error = new assert.AssertionError(
    {
      message  : message,
      actual   : typeof value,
      expected : type,
      operator : 'typeof',
    })

    error.code = 'E_ASSERTION_TYPEOF'
    throw error
  },

  classTag(value, typeTag, message)
  {
    if(typeTag === Object.prototype.toString.call(value))
    {
      return true
    }

    const error = new assert.AssertionError(
    {
      message  : message,
      actual   : Object.prototype.toString.call(value),
      expected : typeTag,
      operator : '===',
    })

    error.code = 'E_ASSERTION_TYPE_TAG'
    throw error
  },

  includes(value, expected, message)
  {
    if(value.includes(expected))
    {
      return true
    }

    const error = new assert.AssertionError(
    {
      message  : message,
      actual   : value,
      expected : expected,
      operator : 'includes',
    })

    error.code = 'E_ASSERTION_INCLUDES'
    throw error
  },

  isArray(value, message)
  {
    if(Array.isArray(value))
    {
      return true
    }

    const error = new assert.AssertionError(
    {
      message  : message,
      actual   : Object.prototype.toString.call(value),
      expected : '[object Array]',
      operator : 'isArray',
    })

    error.code = 'E_ASSERTION_IS_ARRAY'
    throw error
  },

  greaterThan(value, threshold, message)
  {
    if(value > threshold)
    {
      return true
    }

    const error = new assert.AssertionError(
    {
      message  : message,
      actual   : value,
      expected : threshold,
      operator : '>',
    })

    error.code = 'E_ASSERTION_GREATER_THAN'
    throw error
  },

  greaterThanOrEqual(value, threshold, message)
  {
    if(value >= threshold)
    {
      return true
    }

    const error = new assert.AssertionError(
    {
      message  : message,
      actual   : value,
      expected : threshold,
      operator : '>=',
    })

    error.code = 'E_ASSERTION_GREATER_THAN_OR_EQUAL'
    throw error
  },

  lessThan(value, threshold, message)
  {
    if(value < threshold)
    {
      return true
    }

    const error = new assert.AssertionError(
    {
      message  : message,
      actual   : value,
      expected : threshold,
      operator : '<',
    })

    error.code = 'E_ASSERTION_LESS_THAN'
    throw error
  },

  lessThanOrEqual(value, threshold, message)
  {
    if(value <= threshold)
    {
      return true
    }

    const error = new assert.AssertionError(
    {
      message  : message,
      actual   : value,
      expected : threshold,
      operator : '<=',
    })

    error.code = 'E_ASSERTION_LESS_THAN_OR_EQUAL'
    throw error
  },

  bitmask(value, mask, message)
  {
    if((value & mask) === mask)
    {
      return true
    }

    const error = new assert.AssertionError(
    {
      message  : message,
      actual   : value,
      expected : mask,
      operator : 'bitmask',
    })

    error.code = 'E_ASSERTION_BITMASK'
    throw error
  },

  xor(a, b, message)
  {
    if(Boolean(a) !== Boolean(b))
    {
      return true
    }

    const error = new assert.AssertionError(
    {
      message  : message,
      actual   : a,
      expected : b,
      operator : 'xor',
    })

    error.code = 'E_ASSERTION_LOGICAL_XOR'
    throw error
  }
}