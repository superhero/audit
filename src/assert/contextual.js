import assert from '@superhero/audit/assert'

export default (context) => new Proxy(assert,
{
  get(target, prop) 
  {
    const targetedAssertion = target[prop]

    // only proxy functions
    if('function' !== typeof targetedAssertion)
    {
      return targetedAssertion
    }

    // ...error callback for the assertion functions to catch AssertionErrors 
    // and adds a context variable to the Error before rethrowing...
    const onError = error =>
    {
      if(error instanceof assert.AssertionError)
      {
        error.context = context
      }
      throw error
    }

    // ...return a new function that proxy the original assertion function
    return (...args) =>
    {
      try
      {
        const result = targetedAssertion(...args)

        if(result instanceof Promise) 
        {
          // ...if the result is a promise, then attach the error handler to the promise
          return result.catch(onError)
        }
        else
        {
          return result
        }
      }
      catch(error)
      {
        onError(error)
      }
    }
  }
})
