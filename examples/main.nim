import ./napi/napibindings

# Main registration of a module using the init macro
init proc(exports: Module) =

  # This is how you register a function onto the module.
  # The first argument is the number of arguments you expect
  # And the second one is the name of the function
  # It more or less translates to module.exports.hello = function() ...
  exports.registerFn(1, "hello"):
    # All function args can be found in the args array
    # They are stored as napi_values and you need to use
    # conversion methods such as getStr, getInt, getBool, etc. to 
    # get the equivalend Nim value
    let toGreet = args[0].getStr;
    echo "Hello " & toGreet

  # For the opposite conversion, Nim type -> napi_value
  # You can use the %* operator
  let obj = %* {"someNestedProp": true, "someOtherProp": 43}
  # Use this if you want to register a property
  exports.register("someProperty", obj)