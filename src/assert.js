import assert from 'node:assert'

export default
{
  ...assert,
  
  instanceof(value, instance, message)
  {
    if(value instanceof instance)
    {
      return true
    }

    const error = new assert.AssertionError(
    {
      message  : message,
      actual   : Object.prototype.toString.call(value),
      expected : Object.prototype.toString.call(instance),
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