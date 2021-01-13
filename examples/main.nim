import ./napi/napibindings

# Main registration of a module using the init macro
init proc(module: Module) =

  # This is how you register a function onto the module.
  # The first argument is the number of arguments you expect
  # And the second one is the name of the function
  # It more or less translates to module.exports.hello = function() ...
  module.registerFn(1, "hello"):
    # All function args can be found in the args array
    # They are stored as napi_values and you need to use
    # conversion methods such as getStr, getInt, getBool, etc. to 
    # get the equivalent Nim value
    let toGreet = args[0].getStr;
    echo "Hello " & toGreet

  # For the opposite conversion, Nim type -> napi_value
  # You can use the %* operator
  let obj = %* {"someNestedProp": true, "someOtherProp": 43, "arrayProp": [1, 2, "str"]}
  # Use register if you want to register a property
  module.register("someProperty", obj)


  # The previous examples use the high level APIs of the library.
  # If something is not supported in the high level you can work around by
  # using the lower level api.
  # The low level api simply defines Nim types for most of the definitions
  # in the node_api header file
  # You can find the original docs for them here https://nodejs.org/api/n-api.html#n_api_basic_n_api_data_types

  var
    lowObj: napi_value
    value: napi_value
  assessStatus module.env.napi_create_string_utf8("level", 5, addr value)
  assessStatus module.env.napi_create_object(addr lowObj);
  assessStatus module.env.napi_set_named_property(lowObj, "low", value)
  module.register("lowLevel", lowObj)