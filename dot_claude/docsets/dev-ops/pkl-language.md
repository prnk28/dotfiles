---
tags:
  - "#documentation"
  - "#software"
  - "#programming"
  - "#language-reference"
  - "#pkl-language"
  - "#configuration-language"
  - "#programming-concepts"
  - "#language-syntax"
---
# PKL Language Reference

The language reference provides a comprehensive description of every Pkl language feature.

[Comments](https://pkl-lang.org/main/current/language-reference/index.html#comments)

[Numbers](https://pkl-lang.org/main/current/language-reference/index.html#numbers)

[Booleans](https://pkl-lang.org/main/current/language-reference/index.html#booleans)

[Strings](https://pkl-lang.org/main/current/language-reference/index.html#strings)

[Durations](https://pkl-lang.org/main/current/language-reference/index.html#durations)

[Data Sizes](https://pkl-lang.org/main/current/language-reference/index.html#data-sizes)

[Objects](https://pkl-lang.org/main/current/language-reference/index.html#objects)

[Listings](https://pkl-lang.org/main/current/language-reference/index.html#listings)

[Mappings](https://pkl-lang.org/main/current/language-reference/index.html#mappings)

[Classes](https://pkl-lang.org/main/current/language-reference/index.html#classes)

[Methods](https://pkl-lang.org/main/current/language-reference/index.html#methods)

[Modules](https://pkl-lang.org/main/current/language-reference/index.html#modules)

[Null Values](https://pkl-lang.org/main/current/language-reference/index.html#null-values)

[If Expressions](https://pkl-lang.org/main/current/language-reference/index.html#if-expressions)

[Resources](https://pkl-lang.org/main/current/language-reference/index.html#resources)

[Errors](https://pkl-lang.org/main/current/language-reference/index.html#errors)

[Debugging](https://pkl-lang.org/main/current/language-reference/index.html#debugging)

[Advanced Topics](https://pkl-lang.org/main/current/language-reference/index.html#advanced-topics)

For a hands-on introduction, see [Tutorial](https://pkl-lang.org/main/current/language-tutorial/index.html).<br/>
For ready-to-go examples with full source code, see [Examples](https://pkl-lang.org/main/current/examples.html).<br/>
For API documentation, see [Standard Library](https://pkl-lang.org/main/current/standard-library.html).

## [Comments](https://pkl-lang.org/main/current/language-reference/index.html#comments)

Pkl has three forms of comments:

Line comment

A code comment that starts with a double-slash (`//`) and runs until the end of the line.

```pkl hljs
// Single-line comment
```

Block comment

A nestable multiline comment, which is typically used to comment out code.<br/>
Starts with `/*` and ends with `*/`.

```pkl hljs
/*
  Multiline
  comment
*/
```

Doc comment

A user-facing comment attached to a program member.<br/>
It starts with a triple-slash (`///`) and runs until the end of the line.<br/>
Doc comments on consecutive lines are merged.

```pkl hljs
/// A *bird* superstar.
/// Unfortunately, extinct.
dodo: Bird
```

Doc comments are processed by [Pkldoc](https://pkl-lang.org/main/current/pkl-doc/index.html), Pkl's documentation generator.<br/>
For details on their syntax, see [Doc Comments](https://pkl-lang.org/main/current/language-reference/index.html#doc-comments).

## [Numbers](https://pkl-lang.org/main/current/language-reference/index.html#numbers)

Pkl has two numeric types, [Int](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Int) and [Float](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Float).<br/>
Their common supertype is [Number](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Number).

### [Integers](https://pkl-lang.org/main/current/language-reference/index.html#integers)

A value of type [Int](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Int) is a 64-bit signed integer.

Integer literals can be written in decimal, hexadecimal, binary, or octal notation:

```pkl hljs
num1 = 123
num2 = 0x012AFF (1)
num3 = 0b00010111 (2)
num4 = 0o755 (3)
```

|       |                |
| ----- | -------------- |
| **1** | decimal: 76543 |
| **2** | decimal: 23    |
| **3** | decimal: 493   |

Integers can optionally include an underscore as a separator to improve readability.<br/>
An underscore does not affect the integer's value.

```pkl hljs
num1 = 1_000_000 (1)
num2 = 0x0134_64DE (2)
num3 = 0b0001_0111 (3)
num4 = 0o0134_6475 (4)
```

|       |                            |
| ----- | -------------------------- |
| **1** | Equivalent to `1000000`    |
| **2** | Equivalent to `0x013464DE` |
| **3** | Equivalent to `0b00010111` |
| **4** | Equivalent to `0o01346475` |

Negative integer literals start with a minus sign, as in `-123`.

Integers support the standard comparison operators:

```pkl hljs
comparison1 = 5 == 2
comparison2 = 5 < 2
comparison3 = 5 > 2
comparison4 = 5 <= 2
comparison5 = 5 >= 2
```

icon](<https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy>)Copied!

|       |                                              |
| ----- | -------------------------------------------- |
| **1** | addition (result: `7`)                       |
| **2** | subtraction (result: `3`)                    |
| **3** | multiplication (result: `10`)                |
| **4** | division (result: `2.5`, always `Float`)     |
| **5** | integer division (result: `2`, always `Int`) |
| **6** | remainder (result: `1`)                      |
| **7** | exponentiation (result: `25`)                |

Arithmetic overflows are caught and result in an error.

copy icon](<https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy>)Copied!

### [Floats](https://pkl-lang.org/main/current/language-reference/index.html#floats)

A value of type [Float](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Float) is a 64-bit [double-precision](https://en.wikipedia.org/wiki/Double-precision_floating-point_format) floating point number.

Float literals use decimal notation.<br/>
They consist of an integer part, decimal point, fractional part, and exponent part.<br/>
The integer and exponent parts are optional.

```pkl hljs
num1 = .23
num2 = 1.23
num3 = 1.23e2 (1)
num4 = 1.23e-2 (2)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                     |
| ----- | ------------------- | ----- |
| **1** | result: 1.23 \* 102 | <br/> |

tANumber = NaN<br/>
positiveInfinity = Infinity<br/>
negativeInfinity = -Infinity

````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

The [NaN](https://pkl-lang.org/package-docs/pkl/0.28.1/base/#NaN) and [Infinity](https://pkl-lang.org/package-docs/pkl/0.28.1/base/#Infinity) properties are defined in the standard library.

Floats support the same comparison and arithmetic operators as integers.<br/>
Float literals with a fractional part of zero can be safely replaced with integer literals.<br/>
For example, it is safe to write `1.3 * 42` instead of `1.3 * 42.0`.

Floats can also include the same underscore separator as integers. For example, `1_000.4_400` is a float whose value is equivalent to `1000.4400`.

|     |     |
| --- | --- |


To restrict a float's range, use the [isBetween](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Number#isBetween) type constraint:

```pkl hljs
x: Float(isBetween(0, 10e6))
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

## [Booleans](https://pkl-lang.org/main/current/language-reference/index.html#booleans)

A value of type [Boolean](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Boolean) is either `true` or `false`.

Apart from the standard logical operators, `Boolean` has<br/>
[xor](<https://pkl-lang.org/package-docs/pkl/0.28.1/base/Boolean#xor()>) and [implies](<https://pkl-lang.org/package-docs/pkl/0.28.1/base/Boolean#implies()>) methods.

octicons-16.svg#view-clippy)Copied!

|       |                                        |
| ----- | -------------------------------------- |
| **1** | logical conjunction (result: `false`)  |
| **2** | logical disjunction (result: `true`)   |
| **3** | logical negation (result: `true`)      |
| **4** | exclusive disjunction (result: `true`) |
| **5** | logical implication (result: `false`)  |

## [Strings](https://pkl-lang.org/main/current/language-reference/index.html#strings)

A value of type [String](https://pkl-lang.org/package-docs/pkl/0.28.1/base/String) is a sequence of Unicode code points.

String literals are enclosed in double quotes:

```pkl expression hljs
"Hello, World!"
```

ppy)Copied!

|     |                                                                                                                                                                                                                                                         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     | Except for a few minor differences \[[1](https://pkl-lang.org/main/current/language-reference/index.html#_footnotedef_1 "View footnote.")\],<br>String literals have the same syntax and semantics as in Swift 5. Learn one of them, know both of them! |

Inside a string literal, the following character escape sequences have special meaning:

slash

Unicode escape sequences have the form `\u{<codePoint>}`, where `<codePoint>` is a hexadecimal number between 0 and 10FFFF:

```pkl expression hljs
"\u{26} \u{E9} \u{1F600}" (1)
```

pkl expression![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                    |
| ----- | ------------------ |
| **1** | result: `"& é 😀"` |

To concatenate strings, use the `+` (plus) operator, as in `"abc" + "def" + "ghi"`.

### [String Interpolation](https://pkl-lang.org/main/current/language-reference/index.html#string-interpolation)

g = "Hi, \(name)!" (1)

````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | result: `"Hi, Dodo!"` |

Before a result is inserted, it is converted to a string:

```pkl hljs
x = 42
str = "\(x + 2) plus \(x * 2) is \(0x80)" (1)
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                               |
| ----- | ----------------------------- |
| **1** | result: `"44 plus 84 is 128"` |

### [Multiline Strings](https://pkl-lang.org/main/current/language-reference/index.html#multiline-strings)

To write a string that spans multiple lines, use a multiline string literal:

```pkl expression hljs
"""
Although the Dodo is extinct,
the species will be remembered.
"""
```

pkl expression![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Multiline string literals are delimited by three double quotes (`"""`).<br/>
String content and closing delimiter must each start on a new line.

The content of a multiline string starts on the first line after the opening quotes and ends on the last line before the closing quotes.<br/>
Line breaks are included in the string and normalized to `\n`.

The previous multiline string is equivalent to this single-line string.<br/>
Notice that there is no leading or trailing whitespace.

```pkl expression hljs
"Although the Dodo is extinct,\nthe species will be remembered."
```

pkl expression![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

String interpolation, character escape sequences, and Unicode escape sequences work the same as for single-line strings:

````pkl hljs
bird = "Dodo"
message = """
Although the \(bird) is extinct,
the species will be remembered.
y)Copied!

Each content line must begin with the same whitespace characters as the line containing the closing delimiter,<br/>
which is not included in the string. Any further leading whitespace characters are preserved.<br/>
In other words, line indentation is controlled by indenting lines relative to the closing delimiter.

In the following string, lines have no leading whitespace:

```pkl hljs
str = """
  Although the Dodo
  is extinct,
  the species
ticons-16.svg#view-clippy)Copied!

In the following string, lines are indented between three and five spaces:

```pkl hljs
str = """
     Although the Dodo
       is extinct,
     the species
       will be remembered.
  """
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

### [Custom String Delimiters](https://pkl-lang.org/main/current/language-reference/index.html#custom-string-delimiters)

Some strings contain many verbatim backslash (`\`) or quote (`"`) characters.<br/>
A good example is regular expressions, which make frequent use of backslash characters for escaping.<br/>
In such cases, using the escape sequences `\\` and `\"` quickly becomes tedious and hampers readability.

Instead, leading/closing string delimiters can be customized to start/end with a pound sign (`#`).<br/>
This also affects the escape character, which changes from `\` to `\#`.

All backslash and quote characters in the following string are interpreted verbatim:

```pkl expression hljs
#" \\\\\ """"" "#
```

pkl expression![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Escape sequences and string interpolation still work, and now start with `\#`:

```pkl hljs
bird = "Dodo"
str = #" \\\\\ \#n \#u{12AF} \#(bird) """"" "#
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

More generally, string delimiters and escape characters can be customized to contain _n_ pound signs each, for n >= 1.

In the following string, _n_ is 2. As a result, the string content is interpreted verbatim:<br/>
/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

### [String API](https://pkl-lang.org/main/current/language-reference/index.html#string-api)

The `String` class offers a [rich API](https://pkl-lang.org/package-docs/pkl/0.28.1/base/String).<br/>
Here are just a few examples:

```pkl hljs
strLength = "dodo".length (1)
reversedStr = "dodo".reverse() (2)
hasAx = "dodo".contains("alive") (3)
trimmed = "  dodo  ".trim() (4)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

| | |<br/>
ult: `"dodo"` |

## [Durations](https://pkl-lang.org/main/current/language-reference/index.html#durations)

A value of type [Duration](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Duration) has a _value_ component of type `Number` and a _unit_ component of type `String`.<br/>
The unit component is constrained to the units defined in [DurationUnit](https://pkl-lang.org/package-docs/pkl/0.28.1/base/#DurationUnit).

Durations are constructed with the following `Number` properties:

```pkl hljs
duration1 = 5.ns  // nanoseconds (smallest unit)
duration2 = 5.us  // microseconds
duration3 = 5.ms  // milliseconds
ys (largest unit)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

A duration can be negative, as in `-5.min`.<br/>
It can have a floating point value, as in `5.13.min`.<br/>
The [value](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Duration#value) and [unit](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Duration#unit) properties provide access to the duration's components.

Durations support the standard comparison operators:

```pkl hljs
comparison1 = 5.min == 3.s
comparison2 = 5.min < 3.s
comparison3 = 5.min > 3.s
comparison4 = 5.min <= 3.s
comparison5 = 5.min >= 3.s
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Durations support the same arithmetic operators as numbers:

```pkl hljs
res1 = 5.min + 3.s    (1)
res2 = 5.min - 3.s    (2)
 = 5.min ~/ 3.min (7)
res8 = 5.min % 3      (8)
res9 = 5.min ** 3     (9)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                  |
| ----- | -------------------------------- |
| **1** | result: `5.05.min`               |
| **2** | result: `4.95.min`               |
| **3** | result: `15.min`                 |
| **4** | result: `1.6666666666666667.min` |
| **5** | result: `1.6666666666666667`     |
| **6** | result: `1.min`                  |
| **7** | result: `1`                      |
| **8** | result: `2.min`                  |
| **9** | result: `125.min`                |

The value component can be an expression:

````pkl hljs
x = 5
xMinutes = x.min (1)
g/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | result: `5.min` |
| **2** | result: `8.s` |

## [Data Sizes](https://pkl-lang.org/main/current/language-reference/index.html\#data-sizes)

A value of type [DataSize](https://pkl-lang.org/package-docs/pkl/0.28.1/base/DataSize) has a _value_ component of type `Number` and a _unit_ component of type `String`.<br/>
The unit component is constrained to the units defined in [DataSizeUnit](https://pkl-lang.org/package-docs/pkl/0.28.1/base/#DataSizeUnit).

Data sizes with decimal units (factor 1000) are constructed with the following `Number` properties:

```pkl hljs
datasize1 = 5.b  // bytes (smallest unit)
datasize2 = 5.kb // kilobytes
datasize3 = 5.mb // megabytes
datasize4 = 5.gb // gigabytes
datasize5 = 5.tb // terabytes
datasize6 = 5.pb // petabytes (largest unit)
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Data sizes with binary units (factor 1024) are constructed with the following `Number` properties:<br/>
mebibytes<br/>
datasize4 = 5.gib // gibibytes<br/>
datasize5 = 5.tib // tebibytes<br/>
datasize6 = 5.pib // pebibytes (largest unit)

````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

A data size can be negative, as in `-5.mb`.<br/>
It can have a floating point value, as in `5.13.mb`.<br/>
The [value](https://pkl-lang.org/package-docs/pkl/0.28.1/base/DataSize#value) and [unit](https://pkl-lang.org/package-docs/pkl/0.28.1/base/DataSize#unit) properties provide access to the data size's components.

Data sizes support the standard comparison operators:

```pkl hljs
comparison1 = 5.mb == 3.kib
b
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Data sizes support the same arithmetic operators as numbers:

````pkl hljs
res1 = 5.mb + 3.kib (1)
res2 = 5.mb - 3.kib (2)
res3 = 5.mb * 3     (3)
res4 = 5.mb / 3     (4)
res5 = 5.mb / 3.mb  (5)
res6 = 5.mb ~/ 3    (6)
res7 = 5.mb ~/ 3.mb (7)
res8 = 5.mb % 3     (8)
ns-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | result: `5.003072.mb` |
| **2** | result: `4.996928.mb` |
| **3** | result: `15.mb` |
| **4** | result: `1.6666666666666667.mb` |
| **5** | result: `1.6666666666666667` |
| **6** | result: `1.mb` |
| **7** | result: `1` |
| **8** | result: `2.mb` |
| **9** | result: `125.mb` |

The value component can be an expression:

```pkl hljs
x = 5
xMegabytes = x.mb (1)
y = 3
xyKibibytes = (x + y).kib (2)
````

|       |                 |
| ----- | --------------- |
| **1** | result: `5.mb`  |
| **2** | result: `8.kib` |

## [Objects](https://pkl-lang.org/main/current/language-reference/index.html#objects)

An object is an ordered collection of _values_ indexed by _name_.

An object's key-value pairs are called its _properties_.<br/>
Property values are lazily evaluated on the first read.

Because Pkl's objects differ in important ways from objects in general-purpose programming languages,<br/>
and because they are the backbone of most data models, understanding objects is the key to understanding Pkl.

### [Defining Objects](https://pkl-lang.org/main/current/language-reference/index.html#defining-objects)

Let's define an object with properties `name` and `extinct`:

````pkl hljs
dodo { (1)
ge-reference/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | Defines a module property named `dodo`.<br>The open curly brace (`{`) indicates that the value of this property is an object. |
| **2** | Defines an object property named `name` with string value `"Dodo"`. |
| **3** | Defines an object property named `extinct` with boolean value `true`. |
| **4** | The closing curly brace indicates the end of the object definition. |

To access an object property by name, use dot (`.`) notation:

```pkl hljs
dodoName = dodo.name
cticons-16.svg#view-clippy)Copied!

Objects can be nested:

```pkl hljs
dodo {
  name = "Dodo"
  taxonomy { (1)
    `class` = "Aves" (2)
  }
}
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

| | |<br/>
its value is another object. |<br/>
| **2** | The word `class` is a keyword of Pkl, and needs to be wrapped in backticks (`` ` ``) to be used as a property. |

As you probably guessed, the nested property `class` can be accessed with `dodo.taxonomy.class`.

Like all values, objects are _immutable_, which is just a fancy (and short!) way to say that their properties never change.<br/>
So what happens when Dodo moves to a different street? Do we have to construct a new object from scratch?

### [Amending Objects](https://pkl-lang.org/main/current/language-reference/index.html#amending-objects)

Fortunately, we don't have to.<br/>
An object can be _amended_ to form a new object that only differs in selected properties.<br/>
Here is how this looks:

````pkl hljs
tortoise = (dodo) { (1)
://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | Defines a module property named `tortoise`.<br>Its value is an object that _amends_ `dodo`.<br>Note that the amended object must be enclosed in parentheses. |
| **2** | Object property `tortoise.taxonomy` _amends_ `dodo.taxonomy`. |
| **3** | Object property `tortoise.taxonomy.class` _overrides_ `dodo.taxonomy.class`. |

As you can see, it is easy to construct a new object that overrides selected properties of an existing object,<br/>
even if, as in our example, the overridden property is nested inside another object.

|     |     |
| --- | --- |
|  | If this way of constructing new objects from existing objects reminds you of prototypical inheritance, you are spot-on:<br>Pkl objects use prototypical inheritance as known from languages such as JavaScript.<br>But unlike in JavaScript, their prototype chain cannot be directly accessed or even modified.<br>Another difference is that in Pkl, object properties are late-bound. Read on to see what this means. |

|     |     |
| --- | --- |
|  | Amends declaration vs. amends expression

The [defining objects](https://pkl-lang.org/main/current/language-reference/index.html#defining-objects) and [amending objects](https://pkl-lang.org/main/current/language-reference/index.html#amending-objects) sections cover two notations that are both a form of amending; called an _amends declaration_ and an _amends expression_, respectively.

```pkl hljs
pigeon { (1)
(https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | Amends declaration. |
| **2** | Amends expression. |

An amends declaration amends a property of the same name if the property exists within a parent module.<br/>
Otherwise, an amends declaration implicitly amends [Dynamic](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Dynamic).

Another way to think about an amends declaration is that it is shorthand for assignment.<br/>
In practical terms, `pigeon {}` is the same as `pigeon = (super.pigeon) {}`.

Amending object bodies can be chained for both an amends declaration and an amends expression.

```pkl hljs
pigeon {
  name = "Common wood pigeon"
} {
  extinct = false
} (1)

dodo = (pigeon) {
  name = "Dodo"
} {
  extinct = true
} (2)
````

!

|       |                                                                                |
| ----- | ------------------------------------------------------------------------------ | --- |
| **1** | Chained amends declaration.                                                    |
| **2** | Chained amends expression (`(pigeon) { …​ } { …​ }` is the amends expression). |     |

### [Late Binding](https://pkl-lang.org/main/current/language-reference/index.html#late-binding)

Let's move on to Pkl's secret sauce:<br/>
the ability to define an object property's value in terms of another property's value, and the resulting _late binding_ effect.<br/>
Here is an example:

````pkl hljs
penguin {
  eggIncubation = 40.d


|     |     |
| --- | --- |
| **1** | result: `4000` |

We have defined a hypothetical `penguin` object whose `adultWeightInGrams` property is defined in terms of the `eggIncubation` duration.<br/>
Can you guess what happens when `penguin` is amended and its `eggIncubation` overridden?

```pkl hljs
madeUpBird = (penguin) {
  eggIncubation = 11.d
}
t/language-reference/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | result: `1100` |

As you can see, `madeUpBird`'s `adultWeightInGrams` changed along with its `eggIncubation`.<br/>
This is what we mean when we say that object properties are _late-bound_.

|     |     |
| --- | --- |
|  | Spreadsheet Programming<br>A good analogy is that object properties behave like spreadsheet cells.<br>When they are linked, changes to "downstream" properties automatically propagate to "upstream" properties.<br>The main difference is that editing a spreadsheet cell changes the state of the spreadsheet,<br>whereas "editing" a property results in a new object, leaving the original object untouched.<br>It is as if you made a copy of the entire spreadsheet whenever you edited a cell! |

Late binding of properties is an incredibly useful feature for a configuration language.<br/>
It is used extensively in Pkl code (especially in templates) and is the key to understanding how Pkl works.

### [Transforming Objects](https://pkl-lang.org/main/current/language-reference/index.html\#transforming-objects)

Say we have the following object:

```pkl hljs
dodo {
  name = "Dodo"
  extinct = true
}
````

How can property `name` be removed?

The recipe for transforming an object is:

1. Convert the object to a map.
2. Transform the map using `Map`'s [rich API](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Map).
3. If necessary, convert the map back to an object.

Equipped with this knowledge, let's try to accomplish our objective:

```pkl expression hljs
dodo
  .toMap()
  .remove("name")
  .toDynamic()
```

pkl expression![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

The resulting dynamic object is equivalent to `dodo`, except that it no longer has a `name` property.

|     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     | Lazy vs. Eager Data Types<br>Converting an object to a map is a transition from a _lazy_ to an _eager_ data type.<br>All of the object's properties are evaluated and all references between them are resolved.<br>If the map is later converted back to an object, subsequent changes to the object's properties no longer propagate to (previously) dependent properties.<br>To make these boundaries clear, transitioning between _lazy_ and _eager_ data types always requires an explicit method call, such as `toMap()` or `toDynamic()`. |

### [Typed Objects](https://pkl-lang.org/main/current/language-reference/index.html#typed-objects)

Pkl has two kinds of objects:

- A [Dynamic](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Dynamic) object has no predefined structure.\[[2](https://pkl-lang.org/main/current/language-reference/index.html#_footnotedef_2 "View footnote.")\]<br/>
  ies can also be added.<br/>
  So far, we have only used dynamic objects in this chapter.

- A [Typed](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Typed) object has a fixed structure described by a class definition.<br/>
  When a typed object is amended, its properties can be overridden or amended, but new properties cannot be added.<br/>
  In other words, the new object has the same class as the original object.

|     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     | When to Use Typed vs. Dynamic Objects<br>- Use typed objects to build schema-backed data models that are validated\[[3](https://pkl-lang.org/main/current/language-reference/index.html#_footnotedef_3 "View footnote.")\].<br>This is what most templates do.<br> <br>- Use dynamic objects to build schema-less data models that are not validated.<br>Dynamic objects are useful for ad-hoc tasks, tasks that do not justify the effort of writing and maintaining a schema, and for representing data whose structure is unknown. |

Note that every [module](https://pkl-lang.org/main/current/language-reference/index.html#modules) is a typed object. Its properties implicitly define a class,<br/>
and new properties cannot be added when amending the module.

A typed object is backed by a _class_.<br/>
Let's look at an example:

````pkl hljs
class Bird { (1)
  name: String
  lifespan: Int
  migratory: Boolean
}

pigeon = new Bird { (2)
  name = "Pigeon"
  lifespan = 8
  migratory = false
}
pied!

|     |     |
| --- | --- |
| **1** | Defines a class named `Bird` with properties `name`, `lifespan` and `migratory`. |
| **2** | Defines a module property named `pigeon`.<br>Its value is a typed object constructed by instantiating class `Bird`.<br>A type only needs to be stated when the property does not have or inherit a [type annotation](https://pkl-lang.org/main/current/language-reference/index.html#type-annotations).<br>Otherwise, amend syntax (`pigeon { …​ }`) or shorthand instantiation syntax (`pigeon = new { …​ }`) should be used. |

Congratulations, you have constructed your first typed object\[[4](https://pkl-lang.org/main/current/language-reference/index.html#_footnotedef_4 "View footnote.")\]!<br/>
How does it differ from a dynamic object?

The answer is that a typed object has a fixed structure prescribed by its class, which cannot be changed when amending the object:

```pkl hljs
class Bird { (1)
  name: String
  lifespan: Int
}

faultyPigeon = new Bird {
  name = "Pigeon"
  lifespan = 8
-16.svg#view-clippy)Copied!

Evaluating this gives:

```shell hljs
Cannot find property hobby in object of type repl#Bird.

Available properties:
lifespan
name
````

shell![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Class structure is also enforced when instantiating a class.<br/>
Let's try to override property `name` with a value of the wrong type:<br/>
g.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Evaluating this, also fails:

```shell hljs
Expected value of type String, but got type Duration.
Value: 3.min
```

shell![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Typed objects are the fundamental building block for constructing validated data models in Pkl.<br/>
To dive deeper into this topic, continue with [Classes](https://pkl-lang.org/main/current/language-reference/index.html#classes).

|     |                                             |
| --- | ------------------------------------------- |
|     | Converting untyped objects to typed objects |

When you have a `Dynamic` that has all the properties (with the right types and meeting all constraints), you can convert it to a `Typed` by using [`toTyped(<class>)`](<https://pkl-lang.org/package-docs/pkl/0.28.1/base/Dynamic#toTyped()>):

````pkl hljs
class Bird {
  name: String
  lifespan: Int
}

pigeon = new Dynamic { (1)
language-reference/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | Instead of a `new Bird`, `pigeon` can be defined with a `new Dynamic`. |
| **2** | That `Dynamic` is then converted to a `Bird`. | |

### [Property Modifiers](https://pkl-lang.org/main/current/language-reference/index.html\#properties)

#### [Hidden Properties](https://pkl-lang.org/main/current/language-reference/index.html\#hidden-properties)

A property with the modifier `hidden` is omitted from the rendered output and object conversions.<br/>
Hidden properties are also ignored when evaluating equality or hashing (e.g. for `Mapping` or `Map` keys).

```pkl hljs
class Bird {
  name: String
  lifespan: Int
  hidden nameAndLifespanInIndex = "\(name), \(lifespan)" (1)
  nameSignWidth: UInt = nameAndLifespanInIndex.length (2)
}

pigeon = new Bird { (3)
  name = "Pigeon"
  lifespan = 8
}

pigeonInIndex = pigeon.nameAndLifespanInIndex (4)

pigeonDynamic = pigeon.toDynamic() (5)

favoritePigeon = (pigeon) {
  nameAndLifespanInIndex = "Bettie, \(lifespan)"
}

samePigeon = pigeon == favoritePigeon (6)
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                                                                                  |
| ----- | ------------------------------------------------------------------------------------------------ |
| **1** | Properties defined as `hidden` are accessible on any `Bird` instance, but not output by default. |
| **2** | Non-hidden properties can refer to hidden properties as usual.                                   |
| **3** | `pigeon` is an object with _four_ properties, but is rendered with _three_ properties.           |
| **4** | Accessing a `hidden` property from outside the class and object is like any other property.      |
| **5** | Object conversions omit hidden properties, so the resulting `Dynamic` has three properties.      |
| **6** | Objects that differ only in `hidden` property values are considered equal                        |

Invoking Pkl on this file produces the following result.

````pkl hljs
pigeon {
  name = "Pigeon"
  lifespan = 8
  nameSignWidth = 9
}
pigeonInIndex = "Pigeon, 8"
pigeonDynamic {
  name = "Pigeon"
  lifespan = 8
  nameSignWidth = 9
}
n](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

#### [Local properties](https://pkl-lang.org/main/current/language-reference/index.html\#local-properties)

A property with the modifier `local` can only be referenced in the lexical scope of its definition.

```pkl hljs
class Bird {
  name: String
  lifespan: Int
  local separator = "," (1)
  hidden nameAndLifespanInIndex = "\(name)\(separator) \(lifespan)" (2)
}

pigeon = new Bird {
  name = "Pigeon"
  lifespan = 8
}

pigeonInIndex = pigeon.nameAndLifespanInIndex (3)
pigeonSeparator = pigeon.separator // Error (4)
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

. |<br/>
| **2** | Non-local properties can refer to the local property as usual. |<br/>
| **3** | The _value_ of `separator` occurs in `nameAndLifespanInIndex`. |<br/>
| **4** | Pkl does not accept this, as there is no property `separator` on a `Bird` instance. |

Because a `local` property is added to the lexical scope, but not (observably) to the object, you can add `local` properties to `Listing` s and `Mapping` s.

|     |                                                                                                                                                                                                                                                                                                                                                |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     | Import clauses define local properties<br>An _import clause_ defines a local property in the containing module.<br>This means `import "someModule.pkl"` is effectively `const local someModule = import("someModule.pkl")`.<br>Also, `import "someModule.pkl" as otherName` is effectively `const local otherName = import("someModule.pkl")`. |

#### [Fixed properties](https://pkl-lang.org/main/current/language-reference/index.html#fixed-properties)

A property with the `fixed` modifier cannot be assigned to or amended when defining an object of its class.

Bird.pkl

````pkl hljs
fixed laysEggs: Boolean = true

fixed birds: Listing<String> = new {
  "Pigeon"
  "Hawk"
  "Penguin"
Copied!

When amending, assigning to a `fixed` property is an error.<br/>
Similarly, it is an error to use an [amends declaration](https://pkl-lang.org/main/current/language-reference/index.html#amends-declaration) on a fixed property:

invalid.pkl

```pkl hljs
amends "Bird.pkl"

laysEggs = false (1)

birds { (2)
  "Giraffe"
}
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                                   |
| ----- | ------------------------------------------------- |
| **1** | Error: cannot assign to fixed property `laysEggs` |
| **2** | Error: cannot amend fixed property `birds`        |

When extending a class and overriding an existing property definition, the fixedness of the overridden property must be preserved.<br/>
If the property in the parent class is declared `fixed`, the child property must also be declared `fixed`.<br/>
If the property in the parent class is not declared `fixed`, the child property may not add the `fixed` modifier.

````pkl hljs
abstract class Bird {
  fixed canFly: Boolean
  name: String
ps://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | Error: missing modifier `fixed`. |
| **2** | Error: modifier `fixed` cannot be applied to property `name`. |

The `fixed` modifier is useful for defining properties that are meant to be derived from other properties.<br/>
In the following snippet, the property `result` is not meant to be assigned to, because it is derived<br/>
from other properties.

```pkl hljs
class Bird {
  wingspan: Int
  weight: Int
  fixed wingspanWeightRatio: Int = wingspan / weight
}
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Another use-case for `fixed` is to define properties that are meant to be fixed to a class definition.<br/>
In the example below, the `species` of a bird is tied to the class, and therefore is declared `fixed`.

Note that it is possible to define a `fixed` property without a value, for one of two reasons:

1. The type has a default value that makes an explicit default redundant.
2. The property is meant to be overridden by a child class.

```pkl hljs
abstract class Bird {
  fixed species: String (1)
}

class Osprey extends Bird {
  fixed species: "Pandion haliaetus" (2)
}
```

!

|       |                                                                                                                                                                                                                                                          |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1** | No explicit default because the property is overridden by a child class.                                                                                                                                                                                 |
| **2** | Overrides the type from `String` to the [string literal type](https://pkl-lang.org/main/current/language-reference/index.html#string-literal-types) `"Pandion haliaetus"`.<br>Assigning an explicit default would be redundant, therefore it is omitted. |

#### [Const properties](https://pkl-lang.org/main/current/language-reference/index.html#const-properties)

A property with the `const` modifier behaves like the [`fixed`](https://pkl-lang.org/main/current/language-reference/index.html#fixed-properties) modifier,<br/>
with the additional rule that it cannot reference non-const properties or methods.

Bird.pkl

```pkl hljs
const laysEggs: Boolean = true

const examples: Listing<String> = new {
  "Pigeon"
  "Hawk"
  "Penguin"
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Referencing any non-const property or method is an error.

invalid.pkl

```pkl hljs
pigeonName: String = "Pigeon"

onst bird: Bird = new {
  name = pigeonName (1)
  lifespan = birdLifespan(24) (2)
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                                                                |
| ----- | ------------------------------------------------------------------------------ |
| **1** | Error: cannot reference non-const property `pigeonName` from a const property. |
| **2** | Allowed: `birdLifespan` is const.                                              |

It is okay to reference another value _within_ the same const property.

valid.pkl

```pkl hljs
class Bird {
  lifespan: Int
  description: String
  speciesName: "Bird"
}
)
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                                                                                                                              |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **1** | `lifespan` is declared within property `bird`. `speciesName` resolves to `this.speciesName`, where `this` is a value within property `bird`. |

|     |                                                                                                                                                                                           |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     | Because `const` members can only reference themselves and other `const` members, they are not [late bound](https://pkl-lang.org/main/current/language-reference/index.html#late-binding). |

The `const` modifier implies that it is also [fixed](https://pkl-lang.org/main/current/language-reference/index.html#fixed-properties).<br/>
Therefore, the same rules that apply to `fixed` also apply to `const`:

- A `const` property cannot be assigned to or amended when defining an object of its class.
- The const-ness of a property or method must be preserved when it is overridden by a child class.

**Class, Annotation, and Typealias Scoping**

In these following scenarios, any reference to a property or method of its enclosing module requires that the referenced member is `const`:

- Class body
- Annotation body
- Typealiased constrained type

invalid2.pkl

```pkl hljs
ace with \(pigeonName)" } (2)
oldPigeonName: String

typealias IsPigeonName = String(pigeonName) (3)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                                                             |
| ----- | --------------------------------------------------------------------------- |
| **1** | Error: cannot reference non-const property `pigeonName` from a class.       |
| **2** | Error: cannot reference non-const property `pigeonName` from an annotation. |
| **3** | Error: cannot reference non-const property `pigeonname` from a typealias.   |

This rule exists because classes, annotations, and typealiases are not [late bound](https://pkl-lang.org/main/current/language-reference/index.html#late-binding);<br/>
it is not possible to change the definition of these members by amending the module<br/>
where it is defined.<br/>
erenced property\*\*

One solution is to add the `const` modifier to the property being referenced.

Birds.pkl

```diff hljs
-pigeonName: String = "Pigeon"
+const pigeonName: String = "Pigeon"

 class Bird {
   name: String = pigeonName
 }
```

diff![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

This solution makes sense if `pigeonName` does not get assigned/amended when amending module `Birds.pkl` (modules are regular objects that can be amended).

**Self-import the module**

Birds.pkl

onName

- name: String = Birds.pigeonName<br/>
  }

````

diff![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | module `Birds` imports itself |

This solution works because an import clause implicitly defines a `const local` property and amending this module does not affect a self-import.

This makes sense if property `pigeonName` **does** get assigned/amended when amending module `Birds.pkl`.

## [Listings](https://pkl-lang.org/main/current/language-reference/index.html\#listings)

A value of type [Listing](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Listing) is an ordered, indexed collection of _elements_.

ualities of lists and objects:

- Like lists, listings can contain arbitrary elements.
- Like objects, listings excel at defining and amending nested literal data structures.
- Like objects, listings can only be directly manipulated through amendment,<br/>
but converting them to a list (and, if necessary, back to a listing) opens the door to arbitrary transformations.

- Like object properties, listing elements are evaluated lazily, can be defined in terms of each other, and are late-bound.

|     |     |
| --- | --- |
|  | When to use Listing vs. [List](https://pkl-lang.org/main/current/language-reference/index.html#lists)<br>- When a collection of elements needs to be specified literally, use a listing.<br>  <br>- When a collection of elements needs to be transformed in a way that cannot be achieved by [amending](https://pkl-lang.org/main/current/language-reference/index.html#amending-listings) a listing, use a list.<br>  <br>- If in doubt, use a listing.<br>  <br>Templates and schemas should almost always use listings instead of lists.<br>Note that listings can be converted to lists when the need arises. |

### [Defining Listings](https://pkl-lang.org/main/current/language-reference/index.html\#defining-listings)

Listings have a literal syntax that is similar to that of objects.<br/>
Here is a listing with two elements:

```pkl hljs
birds = new Listing { (1)
 }
}
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                                                                                                                                                                                                                                                                                                                                                                          |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1** | Defines a module property named `birds` with a value of type `Listing`.<br>A type only needs to be stated when the property does not have or inherit a [type annotation](https://pkl-lang.org/main/current/language-reference/index.html#listing-type-annotations).<br>Otherwise, amend syntax (`birds { …​ }`) or shorthand instantiation syntax (`birds = new { …​ }`) should be used. |
| **2** | Defines a listing element of type `Dynamic`.                                                                                                                                                                                                                                                                                                                                             |
| **3** | Defines another listing element of type `Dynamic`.<br>The order of definitions is relevant.                                                                                                                                                                                                                                                                                              |

To access an element by index, use the `[]` (subscript) operator:

```pkl hljs
firstBirdName = birds[0].name  (1)
secondBirdDiet = birds[1].diet (2)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                    |
| ----- | ------------------ | ----- |
| **1** | result: `"Pigeon"` | <br/> |

w Listing {<br/>
"Pigeon" (1)<br/>
3.min (2)<br/>
new Listing { (3)<br/>
"Barn owl"<br/>
}<br/>
}

````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | Defines a listing element of type `String`. |
| **2** | Defines a listing element of type `Duration`. |
| **3** | Defines a listing element of type `Listing`. |

Listings can have `local` properties:

```pkl hljs
listing = new Listing {
  local pigeon = "Pigeon" (1)
guage-reference/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | Defines a local property with the value `"Pigeon"`.<br>Local properties can have a type annotation, as in `pigeon: String = "Pigeon"`. |
| **2** | Defines a listing element that references the local property. |
| **3** | Defines another listing element that references the local property. |

### [Amending Listings](https://pkl-lang.org/main/current/language-reference/index.html\#amending-listings)

Let's say we have the following listing:

```pkl hljs
birds = new Listing {
  new {
    name = "Pigeon"
    diet = "Seeds"
  }
  new {
    name = "Parrot"
    diet = "Berries"
  }
}
````

!

To add, override, or amend elements of this listing, amend the listing itself:

```pkl hljs
birds2 = (birds) { (1)
  new { (2)
    name = "Barn owl"
    diet = "Mice"
  }
  [0] { (3)
    diet = "Worms"
  }
  [1] = new { (4)
    name = "Albatross"
    diet = "Fish"
  }
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                                                                                          |
| ----- | -------------------------------------------------------------------------------------------------------- |
| **1** | Defines a module property named `birds2`. Its value is a listing that amends `birds`.                    |
| **2** | Defines a listing element of type `Dynamic`.                                                             |
| **3** | Amends the listing element at index 0 (whose name is `"Pigeon"`) and overrides property `diet`.          |
| **4** | Overrides the listing element at index 1 (whose name is `"Parrot"`) with an entirely new dynamic object. |

### [Late Binding](https://pkl-lang.org/main/current/language-reference/index.html#late-binding-2)

A listing element can be defined in terms of another element.<br/>
To reference the element at index `<index>`, use `this[<index>]`:

````pkl hljs
birds = new Listing {
  new { (1)
    name = "Pigeon"
    diet = "Seeds"
age-reference/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | Defines a listing element of type `Dynamic`. |
| **2** | Defines a listing element that amends the element at index 0 and overrides `name`. |

Listing elements are late-bound:

```pkl hljs
newBirds = (birds) { (1)
  [0] {
    diet = "Worms"
  }
}

secondBirdDiet = newBirds[1].diet (2)
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                                                                                                           |
| ----- | ------------------------------------------------------------------------------------------------------------------------- |
| **1** | Amends listing `birds` and overrides property `diet` of element 0 (whose name is "Pigeon"\`) to have the value `"Worms"`. |
| **2** | Because element 1 is defined in terms of element 0, its `diet` property also changes to `"Worms"`.                        |

### [Transforming Listings](https://pkl-lang.org/main/current/language-reference/index.html#transforming-listings)

Say we have the following listing:

```pkl hljs
birds = new Listing {
  new {
    name = "Pigeon"
    diet = "Seeds"
  }
  new {
    name = "Parrot"
    diet = "Berries"
  }
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

How can the order of elements be reversed programmatically?

The recipe for transforming a listing is:

1. Convert the listing to a list.
2. Transform the list using `List`'s [rich API](https://pkl-lang.org/package-docs/pkl/0.28.1/base/List).
3. If necessary, convert the list back to a listing.

|     |                                                                                                                                                                                                                                                                                                                                            |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|     | Often, transformations happen in a [converter](https://pkl-lang.org/package-docs/pkl/0.28.1/base/PcfRenderer#converters) of a [value renderer](https://pkl-lang.org/package-docs/pkl/0.28.1/base/ValueRenderer).<br>Because most value renderers treat lists the same as listings, it is often not necessary to convert back to a listing. |

Equipped with this knowledge, let's try to accomplish our objective:

```pkl hljs
reversedbirds = birds
  .toList()
  .reverse()
  .toListing()
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

`result` now contains the same elements as `birds`, but in reverse order.

|     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     | Lazy vs. Eager Data Types<br>Converting a listing to a list is a transition from a _lazy_ to an _eager_ data type.<br>All of the listing's elements are evaluated and all references between them are resolved.<br>If the list is later converted back to a listing, subsequent changes to the listing's elements no longer propagate to (previously) dependent elements.<br>To make these boundaries clear, transitioning between _lazy_ and _eager_ data types always requires an explicit method call, such as `toList()` or `toListing()`. |

### [Default Element](https://pkl-lang.org/main/current/language-reference/index.html#default-element)

Listings can have a _default element_:

```pkl hljs
birds = new Listing {
  default { (1)
    lifespan = 8
  }
  new { (2)
    name = "Pigeon" (3)
  }
  new { (4)
    name = "Parrot"
    lifespan = 20 (5)
  }
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Defines a new listing element that implicitly amends the default element. |<br/>
| **3** | Defines a new property called `name`. Property `lifespan` is inherited from the default element. |<br/>
| **4** | Defines a new listing element that implicitly amends the default element. |<br/>
| **5** | Overrides the default for property `lifespan`. |

`default` is a hidden (that is, not rendered) [property](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Listing#default) defined in class `Listing`.<br/>
If `birds` had a [type annotation](https://pkl-lang.org/main/current/language-reference/index.html#listing-type-annotations), a suitable default element would be inferred from its type parameter.<br/>
If, as in our example, no type annotation is provided or inherited, the default element is the empty `Dynamic` object.

Like regular listing elements, the default element is late-bound.<br/>
As a result, defaults can be changed retroactively:

````pkl hljs
birds2 = (birds) {
  default {
ference/img/octicons-16.svg#view-clippy)Copied!

Because both of `birds`'s elements amend the default element, changing the default element also changes them.<br/>
An equivalent literal definition of `birds2` would look as follows:

```pkl hljs
birds2 = new Listing {
  new {
    name = "Pigeon"
    lifespan = 8
    diet = "Seeds"
  }
  new {
    name = "Parrot"
    lifespan = 20
    diet = "Berries"
  }
}
````

!

Note that Parrot kept its diet because its prior self defined it explicitly, overriding any default.

If you are interested in the technical underpinnings of default elements (and not afraid of dragons!), continue with [Function Amending](https://pkl-lang.org/main/current/language-reference/index.html#function-amending).

### [Type Annotations](https://pkl-lang.org/main/current/language-reference/index.html#listing-type-annotations)

To declare the type of a property that is intended to hold a listing, use:

```pkl hljs
x: Listing<ElementType>
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

This declaration has the following effects:

in/current/language-reference/index.html#default-values), that value becomes the listing's default element.

- The first time `x` is read,
- its value is checked to have type `Listing`.
- the listing's elements are checked to have the type `ElementType`.

Here is an example:

```pkl hljs
class Bird {
  name: String
  lifespan: Int
}

birds: Listing<Bird>
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Because the default value for type `Bird` is `new Bird {}`, that value becomes the listing's default element.

Let's go ahead and populate `birds`:

````pkl hljs
birds {
  new {
icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Thanks to `birds`'s default element, which was inferred from its type,<br/>
it is not necessary to state the type of each list element<br/>
(`new Bird { …​ }`, `new Bird { …​ }`, etc.).

#### [Distinct Elements](https://pkl-lang.org/main/current/language-reference/index.html\#distinct-elements)

To constrain a listing to distinct elements, use `Listing`'s [isDistinct](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Listing#isDistinct) property:

```pkl hljs
class Bird {
  name: String
  lifespan: Int
}

birds: Listing<Bird>(isDistinct)
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!<br/>
l-lang.org/main/current/language-reference/index.html#sets).

To demand distinct names instead of distinct `Bird` objects, use [isDistinctBy()](<https://pkl-lang.org/package-docs/pkl/0.28.1/base/Listing#isDistinctBy()>):

```pkl hljs
birds: Listing<Bird>(isDistinctBy((it) -> it.name))
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

## [Mappings](https://pkl-lang.org/main/current/language-reference/index.html#mappings)

A value of type [Mapping](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Mapping) is an ordered collection of _values_ indexed by _key_.

|     |                                                                                                                                                                                                               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     | Most of what has been said about [listings](https://pkl-lang.org/main/current/language-reference/index.html#listings) also applies to mappings.<br>Nevertheless, this section is written to stand on its own. |

A mapping's key-value pairs are called its _entries_.<br/>
Keys are eagerly evaluated; values are lazily evaluated on the first read.

Mappings combine qualities of maps and objects:

- Like maps, mappings can contain arbitrary key-value pairs.
- Like objects, mappings excel at defining and amending nested literal data structures.
- Like objects, mappings can only be directly manipulated through amendment,<br/>
  owns.

- Like object properties, a mapping's values (but not its keys) are evaluated lazily, can be defined in terms of each other, and are late-bound.

|     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     | When to use Mapping vs. [Map](https://pkl-lang.org/main/current/language-reference/index.html#maps)<br>- When key-value style data needs to be specified literally, use a mapping.<br> <br>- When key-value style data needs to be transformed in a way that cannot be achieved by [amending](https://pkl-lang.org/main/current/language-reference/index.html#amending-mappings) a mapping, use a map.<br> <br>- If in doubt, use a mapping.<br> <br>Templates and schemas should almost always use mappings instead of maps.<br>Note that mappings can be converted to maps when the need arises. |

### [Defining Mappings](https://pkl-lang.org/main/current/language-reference/index.html#defining-mappings)

Mappings have the same literal syntax as objects, except that keys enclosed in `[]` take the place of property names.<br/>
Here is a mapping with two entries:

````pkl hljs
birds = new Mapping { (1)
  ["Pigeon"] { (2)
    lifespan = 8
    diet = "Seeds"
  }
in/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | Defines a module property named `birds` with a value of type `Mapping`.<br>A type only needs to be stated when the property does not have or inherit a [type annotation](https://pkl-lang.org/main/current/language-reference/index.html#mapping-type-annotations).<br>Otherwise, amend syntax (`birds { …​ }`) or shorthand instantiation syntax (`birds = new { …​ }`) should be used. |
| **2** | Defines a mapping entry with the key `"Pigeon"` and a value of type `Dynamic`. |
| **3** | Defines a mapping entry with the key `"Parrot"` and a value of type `Dynamic`. |

To access a value by key, use the `[]` (subscript) operator:

```pkl hljs
pigeon = birds["Pigeon"]
parrot = birds["Parrot"]
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Mappings can contain arbitrary types of values:

````pkl hljs
mapping = new Mapping {
  ["number"] = 42
  ["list"] = List("Pigeon", "Parrot")
  ["nested mapping"] {
org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Although string keys are most common, mappings can contain arbitrary types of keys:

```pkl hljs
mapping = new Mapping {
  [3.min] = 42
  [new Dynamic { name = "Pigeon" }] = "abc"
}
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Keys can be computed:

```pkl hljs
mapping = new Mapping {
  ["Pigeon".reverse()] = 42
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

"Pigeon"] { (2)<br/>
friend = parrot<br/>
}<br/>
}

````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | Defines a local property name `parrot` with the value `"Parrot"`.<br>Local properties can have a type annotation, as in `parrot: String = "Parrot"`. |
| **2** | Defines a mapping entry whose value references `parrot`.<br>The local property is visible to values but not keys. |

### [Amending Mappings](https://pkl-lang.org/main/current/language-reference/index.html\#amending-mappings)

Let's say we have the following mapping:

```pkl hljs
birds = new Mapping {
  ["Pigeon"] {
    lifespan = 8
    diet = "Seeds"
  }
  ["Parrot"] {
    lifespan = 20
    diet = "Berries"
  }
Copied!

To add, override, or amend entries of this mapping, amend the mapping:

```pkl hljs
birds2 = (birds) { (1)
  ["Barn owl"] { (2)
    lifespan = 15
    diet = "Mice"
  }
  ["Pigeon"] { (3)
    diet = "Seeds"
  }
  ["Parrot"] = new { (4)
    lifespan = 20
    diet = "Berries"
  }
}
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|                                                          |                                                                                       |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **1**                                                    | Defines a module property named `birds2`. Its value is a mapping that amends `birds`. |
| **2**                                                    | Defines a mapping entry with the key `"Barn owl"` and a value of type `Dynamic`.      |
| `"Parrot"` with an entirely new value of type `Dynamic`. |

### [Late Binding](https://pkl-lang.org/main/current/language-reference/index.html#late-binding-3)

A mapping entry's value can be defined in terms of another entry's value.<br/>
To reference the value with key `<key>`, use `this[<key>]`:

```pkl hljs
birds = new Mapping {
  ["Pigeon"] { (1)
    lifespan = 8
    diet = "Seeds"
  }
  ["Parrot"] = (this["Pigeon"]) { (2)
    lifespan = 20
  }
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!<br/>
Dynamic`. |<br/>
| **2** | Defines a mapping entry with the key `"Parrot"`and a value that amends`"Pigeon"`. |

Mapping values are late-bound:

```pkl hljs
birds2 = (birds) { (1)
  ["Pigeon"] {
    diet = "Seeds"
  }
}

parrotDiet = birds2["Parrot"].diet (2)
```

!

|       |                                                                                                      |
| ----- | ---------------------------------------------------------------------------------------------------- |
| **1** | Amends mapping `birds` and overrides `"Pigeon"`'s `diet` property to have value `"Seeds"`.           |
| **2** | Because `"Parrot"` is defined in terms of `"Pigeon"`, its `diet` property also changes to `"Seeds"`. |

### [Transforming Mappings](https://pkl-lang.org/main/current/language-reference/index.html#transforming-mappings)

Say we have the following mapping:

````pkl hljs
birds = new Mapping {
  ["Pigeon"] {
    lifespan = 8
    diet = "Seeds"
  }
  ["Parrot"] = (this["Pigeon"]) {
    lifespan = 20
  }
}
pied!

How can `birds`'s keys be reversed programmatically?

The recipe for transforming a mapping is:

1. Convert the mapping to a map.
2. Transform the map using `Map`'s [rich API](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Map).
3. If necessary, convert the map back to a mapping.

|     |     |
| --- | --- |
|  | Often, transformations happen in a [converter](https://pkl-lang.org/package-docs/pkl/0.28.1/base/PcfRenderer#converters) of a [value renderer](https://pkl-lang.org/package-docs/pkl/0.28.1/base/ValueRenderer).<br>As most value renderers treat maps the same as mappings, it is often not necessary to convert back to a mapping. |

Equipped with this knowledge, let's try to accomplish our objective:

```pkl hljs
result = birds
  .toMap()
ent/language-reference/img/octicons-16.svg#view-clippy)Copied!

`result` contains the same values as `birds`, but its keys have changed to `"noegiP"` and `"torraP"`.

|     |     |
| --- | --- |
|  | Lazy vs. Eager Data Types<br>Converting a mapping to a map is a transition from a _lazy_ to an _eager_ data type.<br>All of the mapping's values are evaluated and all references between them are resolved.<br>(Mapping keys are eagerly evaluated.)<br>If the map is later converted back to a mapping, changes to the mapping's values no longer propagate to (previously) dependent values.<br>To make these boundaries clear, transitioning between _lazy_ and _eager_ data types always requires an explicit method call, such as `toMap()` or `toMapping()`. |

### [Default Value](https://pkl-lang.org/main/current/language-reference/index.html\#default-value)

Mappings can have a _default value_:

```pkl hljs
birds = new Mapping {
  default { (1)
    lifespan = 8
  }
  ["Pigeon"] { (2)
    diet = "Seeds" (3)
nguage-reference/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | Amends the `default` value and sets property `lifespan`. |
| **2** | Defines a mapping entry with the key `"Pigeon"` that implicitly amends the default value. |
| **3** | Defines a new property called `diet`. Property `lifespan` is inherited from the default value. |
| **4** | Defines a mapping entry with the key `"Parrot"` that implicitly amends the default value. |
| **5** | Overrides the default for property `lifespan`. |

apping#default) defined in class `Mapping`.<br/>
If `birds` had a [type annotation](https://pkl-lang.org/main/current/language-reference/index.html#mapping-type-annotations), a suitable default value would be inferred from its second type parameter.<br/>
If, as in our example, no type annotation is provided or inherited, the default value is the empty `Dynamic` object.

Like regular mapping values, the default value is late-bound.<br/>
As a result, defaults can be changed retroactively:

```pkl hljs
birds2 = (birds) {
  default {
    lifespan = 8
    diet = "Seeds"
  }
}
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Because both of `birds`'s mapping values amend the default value, changing the default value also changes them.<br/>
An equivalent literal definition of `birds2` would look as follows:

```pkl hljs
birds2 = new Mapping {
  ["Pigeon"] {
    lifespan = 8
    diet = "Seeds"
  }
  ["Parrot"] {
    lifespan = 20
    diet = "Berries"
  }
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Note that Parrot kept its lifespan because its prior self defined it explicitly, overriding any default.

If you are interested in the technical underpinnings of default values, continue with [Function Amending](https://pkl-lang.org/main/current/language-reference/index.html#function-amending).

### [Type Annotations](https://pkl-lang.org/main/current/language-reference/index.html#mapping-type-annotations)

To declare the type of a property that is intended to hold a mapping, use:

eference/img/octicons-16.svg#view-clippy)Copied!

This declaration has the following effects:

- `x` is initialized with an empty mapping.
- If `ValueType` has a [default value](https://pkl-lang.org/main/current/language-reference/index.html#default-values), that value becomes the mapping's default value.
- The first time `x` is read,
- its value is checked to have type `Mapping`.
- the mapping's keys are checked to have type `KeyType`.
- the mapping's values are checked to have type `ValueType`.

Here is an example:

````pkl hljs
class Bird {
age-reference/img/octicons-16.svg#view-clippy)Copied!

Because the default value for type `Bird` is `new Bird {}`, that value becomes the mapping's default value.

Let's go ahead and populate `birds`:

```pkl hljs
birds {
  ["Pigeon"] {
    lifespan = 8
  }
  ["Parrot"] {
    lifespan = 20
  }
}
````

Thanks to `birds`'s default value, which was inferred from its type,<br/>
it is not necessary to state the type of each mapping value<br/>
(`["Pigeon"] = new Bird { …​ }`, `["Parrot"] = new Bird { …​ }`, etc.).

## [Classes](https://pkl-lang.org/main/current/language-reference/index.html#classes)

Classes are arranged in a single inheritance hierarchy.<br/>
At the top of the hierarchy sits class [Any](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Any); at the bottom, type [nothing](https://pkl-lang.org/main/current/language-reference/index.html#nothing-type).

lso be `hidden` from rendering.

```pkl hljs
class Bird {
  name: String
  hidden taxonomy: Taxonomy
}

class Taxonomy {
  `species`: String
igeonClass = pigeon.getClass()
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Declaration of new class instances will fail when property names are misspelled:

```pkl hljs
// Detects the spelling mistake
parrot = new Bird {
  namw = "Parrot"
}
```

!

### [Class Inheritance](https://pkl-lang.org/main/current/language-reference/index.html#class-inheritance)

Pkl supports single inheritance with a Java(Script)-like syntax.

```pkl hljs
abstract class Bird {
  name: String
}

class ParentBird extends Bird {
  kids: List<String>
}

pigeon: ParentBird = new {
  name = "Old Pigeon"
  kids = List("Pigeon Jr.", "Teen Pigeon")
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

## [Methods](https://pkl-lang.org/main/current/language-reference/index.html#methods)

perties of their containing type.<br/>
Submodules and subclasses can override them.

Like Java and most other object-oriented languages, Pkl uses *single dispatch* — methods are dynamically dispatched based on the receiver's runtime type.

````pkl hljs
class Bird {
  name: String
  function greet(bird: Bird): String = "Hello, \(bird.name)!" (1)
}

function greetPigeon(bird: Bird): String = bird.greet(pigeon) (2)

pigeon: Bird = new {
  name = "Pigeon"
}
parrot: Bird = new {
  name = "Parrot"
}

ang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | Instance method of class `Bird`. |
| **2** | Module method. |
| **3** | Call instance method on `pigeon`. |
| **4** | Call module method (on `this`). |

Like other object-oriented languages, methods defined on extended classes and modules may be overridden.<br/>
The parent type's method may be called via the [`super` keyword](https://pkl-lang.org/main/current/language-reference/index.html#super-keyword).

|     |     |
| --- | --- |
|  | Methods do not support named parameters or default parameter values.<br>The [Class-as-a-function](https://pkl-lang.org/blog/class-as-a-function.html) pattern may be a suitable replacement. |

|     |     |
| --- | --- |
|  | In most cases, methods without parameters should not be defined.<br>Instead, use [`fixed` properties](https://pkl-lang.org/main/current/language-reference/index.html#fixed-properties) on the module or class. |

## [Modules](https://pkl-lang.org/main/current/language-reference/index.html\#modules)

### [Introduction](https://pkl-lang.org/main/current/language-reference/index.html\#introduction)

Modules are the unit of loading, executing, and sharing Pkl code.<br/>
Every file containing Pkl code is a module.<br/>
/current/language-reference/index.html#module-names) and are loaded from a [Module URI](https://pkl-lang.org/main/current/language-reference/index.html#module-uris).

At runtime, modules are represented as objects of type [Module](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Module).<br/>
The precise runtime type of a module is a subclass of `Module` containing the module's property and method definitions.

Like class members, module members may have type annotations, which are validated at runtime:

```pkl hljs
timeout: Duration(isPositive) = 5.ms

function greet(name: String): String = "Hello, \(name)!"
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Because modules are regular objects, they can be assigned to properties and passed to and returned from methods.

Modules can be [imported](https://pkl-lang.org/main/current/language-reference/index.html#import-module) by other modules.<br/>
In analogy to objects, modules can serve as templates for other modules through [amending](https://pkl-lang.org/main/current/language-reference/index.html#module-amend).<br/>
html#module-extend) to add additional module members.

### [Module Names](https://pkl-lang.org/main/current/language-reference/index.html#module-names)

Modules may declare their name by way of a _module clause_, which consists of the keyword `module` followed by a qualified name:

```pkl hljs
/// My bird module.
module com.animals.Birds
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

A module clause must come first in a module.<br/>
Its doc comment, if present, holds the module's overall documentation.

In the absence of a module clause, a module's name is inferred from the module URI from which the module was first loaded.<br/>
For example, the inferred name for a module first loaded from `https://example.com/pkl/bird.pkl` is `bird`.

Module names do not affect evaluation but are used in diagnostic messages and Pkldoc.<br/>
In particular, they are the first component (everything before the hash sign) of fully qualified member names such as `pkl.base#Int`.

| | |<br/>
nique and stable than an inferred name. |

### [Module URIs](https://pkl-lang.org/main/current/language-reference/index.html#module-uris)

Modules are loaded from _module URIs_.

By default, the following URI types are available for import:

#### [File URI:](https://pkl-lang.org/main/current/language-reference/index.html#file-uri)

Example: `file:///path/to/my_module.pkl`

Represents a module located on a file system.

#### [HTTP(S) URI:](https://pkl-lang.org/main/current/language-reference/index.html#https-uri)

Example: `https://example.com/my_module.pkl`

Represents a module imported via an HTTP(S) GET request.

|     |                                                                                                                     |
| --- | ------------------------------------------------------------------------------------------------------------------- | ----- |
|     | Modules loaded from HTTP(S) URIs are only cached until the `pkl` command exits or the `Evaluator` object is closed. | <br/> |

Example: `modulepath:/path/to/my_module.pkl`

Module path URIs are resolved relative to the _module path_, a search path for modules similar to Java's class path (see the `--module-path` CLI option).<br/>
For example, given the module path `/dir1:/zip1.zip:/jar1.jar`, module `modulepath:/path/to/my_module.pkl` will be searched for in the following locations:

1. `/dir1/path/to/my_module.pkl`
2. `/path/to/my_module.pkl` within `/zip1.zip`
3. `/path/to/my_module.pkl` within `/jar1.jar`

When evaluating Pkl code from Java, `modulepath:/path/to/my_module.pkl` corresponds to class path location `path/to/my_module.pkl`.<br/>
In a typical Java project, this corresponds to file path `src/main/resources/path/to/my_module.pkl` or `src/test/resources/path/to/my_module.pkl`.

#### [Package asset URI:](https://pkl-lang.org/main/current/language-reference/index.html#package-asset-uri)

Example: `package://example.com/mypackage@1.0.0#/my_module.pkl`

Represent a module within a _package_.<br/>
A package is a shareable archive of modules and resources that are published to the internet.

To import `package://example.com/mypackage@1.0.0#/my_module.pkl`, Pkl follows these steps:

1. Make an HTTPS GET request to `https://example.com/mypackage@1.0.0` to retrieve the package's metadata.
2. From the package metadata, download the referenced zip archive, and validate its checksum.
3. Resolve path `/my_module.pkl` within the package's zip archive.

A package asset URI has the following form:<br/>
ackage can also be specified:

```none hljs
'package://' <host> <path> '@' <semver> '::sha256:' <sha256-checksum> '#' <asset path>
```

![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Packages can be managed as dependencies within a _project_.<br/>
For more details, consult the [project](https://pkl-lang.org/main/current/language-reference/index.html#projects) section of the language reference.

#### [Standard Library URI](https://pkl-lang.org/main/current/language-reference/index.html#standard-library-uri)

Example: `pkl:math`

Standard library modules are named `pkl.<simpleName>` and have module URIs of the form `pkl:<simpleName>`.<br/>
For example, module `pkl.math` has module URI `pkl:math`.<br/>
See the [API Docs](https://pkl-lang.org/package-docs/pkl/0.28.1/) for the complete list of standard library modules.

#### [Relative URIs](https://pkl-lang.org/main/current/language-reference/index.html#relative-uris)

Relative module URIs are interpreted relative to the URI of the enclosing module.<br/>
For example, a module with URI `modulepath:/animals/birds/pigeon.pkl`<br/>
can import `modulepath:/animals/birds/parrot.pkl`<br/>
with `import "parrot.pkl"` or `import "/animals/birds/parrot.pkl"`.

eparator on all platforms, including Windows.<br>Paths that contain drive letters (e.g. `C:`) must be declared as an absolute file URI, for example: `import "file:///C:/path/to/my/module.pkl"`. Otherwise, they are interpreted as a URI scheme. |

|     |                                                                                                                                                                                                                                                                              |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     | When importing a relative directory or file that starts with `@`, the import string must be prefixed with `./`.<br>Otherwise, this syntax will be interpreted as [dependency notation](https://pkl-lang.org/main/current/language-reference/index.html#dependency-notation). |

#### [Dependency notation URIs](https://pkl-lang.org/main/current/language-reference/index.html#dependency-notation)

Example: `@birds/bird.pkl`

Dependency notation URIs represent a path within a [project or package dependency](https://pkl-lang.org/main/current/language-reference/index.html#project-dependencies).<br/>
For example, import `@birds/bird.pkl` represents path `/bird.pkl` in a dependency named "birds".

A dependency is either a remote package or a local project dependency.

#### [Extension points](https://pkl-lang.org/main/current/language-reference/index.html#extension-points)

Pkl embedders can register additional module loaders that recognize other types of module URIs.<br/>
can be evaluated directly:

```shell hljs
$ pkl eval path/to/mymodule.pkl
$ pkl eval file:///path/to/my_module.pkl
$ pkl eval https://apple.com/path/to/mymodule.pkl
$ pkl eval --module-path=/pkl-modules modulepath:/path/to/my_module.pkl
$ pkl eval pkl:math
```

shell![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

#### [Triple-dot Module URIs](https://pkl-lang.org/main/current/language-reference/index.html#triple-dot-module-uris)

ath URIs may start with `…/`, a generalization of `../`.<br/>
Module URI `…/foo/bar/baz.pkl` resolves to the first existing module among<br/>
`../foo/bar/baz.pkl`, `../../foo/bar/baz.pkl`, `../../../foo/bar/baz.pkl`, and so on.<br/>
Furthermore, module URI `…` is equivalent to `…/<currentFileName>`.

Using triple-dot module URIs never resolve to the current module.<br/>
For example, a module at path `foo/bar.pkl` that references module URI `…/foo/bar.pkl`<br/>
does not resolve to itself.

### [Amending a Module](https://pkl-lang.org/main/current/language-reference/index.html#module-amend)

Recall how an object is amended:

````pkl hljs
pigeon {
  name = "Pigeon"
  diet = "Seeds"
}

parrot = (pigeon) { (1)
  name = "Parrot"   (2)
Copied!

|     |     |
| --- | --- |
| **1** | Object `parrot` amends object `pigeon`, inheriting all of its members. |
| **2** | `parrot` overrides `name`. |

Amending a module works in the same way, except that the syntax differs slightly:

pigeon.pkl

```pkl hljs
name = "Pigeon"
diet = "Seeds"
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!<br/>
ang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                                                        |
| ----- | ---------------------------------------------------------------------- |
| **1** | Module `parrot` amends module `pigeon`, inheriting all of its members. |
| **2** | `parrot` overrides `name`.                                             |

A module is amended by way of an _amends clause_, which consists of the keyword `amends` followed by the [module URI](https://pkl-lang.org/main/current/language-reference/index.html#module-uris) of the module to amend.

An amends clause comes after the module clause (if present) and before any import clauses:

parrot.pkl

```pkl hljs
module parrot

amends "pigeon.pkl"

import "other.pkl"

name = "Parrot"
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

At most one amends clause is permitted.<br/>
A module cannot have both an amends clause and an extends clause.

An amending module has the same type (that is, module class) as the module it amends.<br/>
As a consequence, it cannot define new properties, methods, or classes, unless they are declared as `local`.<br/>
In our example, this means that module `parrot` can only define (and thus override) the property `name`.<br/>
Spelling mistakes such as `namw` are caught immediately, rather than accidentally defining a new property.

Amending is used to fill in _template modules_:<br/>
example JSON indented with two spaces).

1. The amending module fills in property values as required, relying on the structure, defaults and validation provided by the template module.
2. The amending module is evaluated to produce the final result.

Template modules are often provided by third parties and served over HTTPS.

### [Extending a Module](https://pkl-lang.org/main/current/language-reference/index.html#module-extend)

Recall how a class is extended:

PigeonAndParrot.pkl<br/>
(2)<br/>
name = "Parrot" (3)<br/>
diet = "Berries" (4)<br/>
extinct = false (5)

function say() = "Pkl is great!" (6)<br/>
}

````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | Class `Pigeon` is declared as `open` for extension. |
| **2** | Class `Parrot` extends `Pigeon`, inheriting all of its members. |
| **3** | `Parrot` overrides `name`. |
| **4** | `Parrot` overrides `diet`. |
| **5** | `Parrot` defines a new property named `extinct`. |
| **6** | `Parrot` defines a new function named `say`. |

Extending a module works in the same way, except that the syntax differs slightly:
://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | Module `pigeon` is declared as `open` for extension. |

parrot.pkl

```pkl hljs
extends "pigeon.pkl"    (1)

name = "Parrot"         (2)
diet = "Berries"        (3)
extinct = false         (4)

function say() = "Pkl is great!" (5)
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                                                         |
| ----- | ----------------------------------------------------------------------- |
| **1** | Module `parrot` extends module `pigeon`, inheriting all of its members. |
| **2** | `parrot` overrides `name`.                                              |
| **3** | `parrot` overrides `diet`.                                              |
| **4** | `parrot` defines a new property named `extinct`.                        |
| **5** | `parrot` defines a new function named `say`.                            |

A module is extended by way of an _extends clause_, which consists of the keyword `extends` followed by the [module URI](https://pkl-lang.org/main/current/language-reference/index.html#module-uris) of the module to extend.<br/>
es declared as `open` can be extended.

parrot.pkl

```pkl hljs
module parrot

extends "pigeon.pkl"

import "other.pkl"

name = "Parrot"
diet = "Berries"
extinct = false

function say() = "Pkl is great!"
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

At most one extends clause is permitted.<br/>
A module cannot have both an amends clause and an extends clause.

Extending a module implicitly defines a new module class that extends the original module's class.

### [Importing a Module](https://pkl-lang.org/main/current/language-reference/index.html#import-module)

A module import makes the imported module accessible to the importing module.<br/>
A module is imported by way of either an [import clause](https://pkl-lang.org/main/current/language-reference/index.html#import-clause), or an [import expression](https://pkl-lang.org/main/current/language-reference/index.html#import-expression).

#### [Import Clauses](https://pkl-lang.org/main/current/language-reference/index.html#import-clause)

An import clause consists of the keyword `import` followed by the [module URI](https://pkl-lang.org/main/current/language-reference/index.html#module-uris) of the module to import.<br/>
An import clause comes after module, amends and extends clauses (if present), and before the module body:

parrot.pkl

````pkl hljs
module parrot

amends "pigeon.pkl"
urrent/language-reference/img/octicons-16.svg#view-clippy)Copied!

Multiple import clauses are permitted.

A module import implicitly defines a new `const local` property through which the imported module can be accessed.<br/>
(Remember that modules are regular objects.)<br/>
The name of this property, called _import name_, is constructed from the module URI as follows:

1. Strip the URI scheme, including the colon (`:`).
2. Strip everything up to and including the last forward slash (`/`).
3. Strip any trailing `.pkl` file extension.

Here are some examples:

Local file import

```pkl hljs
kl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

HTTPS import

```pkl hljs
import "https://mycompany.com/modules/pigeon.pkl"

name = pigeon.name
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Standard library import

```pkl hljs
import "pkl:math"

pi = math.Pi
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Package import

```pkl hljs
import "package://example.com/birds@1.0.0#/sparrow.pkl"

name = sparrow.name
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Because its members are automatically visible in every module, the `pkl:base` module is typically not imported.

Occasionally, the default import name for a module may not be convenient or appropriate:

- If not a valid identifier, the import name needs to be enclosed in backticks on each use, for example, `` `my-module`.someMember``.
- The import name may clash with other names in the importing module.

In such a case, a different import name can be chosen:

parrot.pkl

```pkl hljs
import "pigeon.pkl" as piggy

name = "Parrot"
diet = piggy.diet
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     | What makes a good module file name?<br>When creating a new module, especially one intended for import into other modules, try to choose a module file name that makes a good import name:<br>- short<br> <br> <br> <br>Less than six characters, not counting the `.pkl` file extension, is a good rule of thumb.<br> <br>- valid identifier<br> <br> <br> <br>Stick to alphanumeric characters. Use an underscore (`_`) instead of a hyphen (`-`) as a name separator.<br> <br>- descriptive<br> <br> <br> <br>An import name should make sense on its own and when used in qualified member names. |

#### [Import Expressions ( `import()`)](https://pkl-lang.org/main/current/language-reference/index.html#import-expression)

An import expression consists of the keyword `import`, followed by a [module URI](https://pkl-lang.org/main/current/language-reference/index.html#module-uris) wrapped in parentheses:

```pkl hljs
module birds

pigeon = import("pigeon.pkl")
parrot = import("parrot.pkl")
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Unlike import clauses, import expressions only import a value, and do not import a type.<br/>
A type is a name that can be used in type positions, for example, as a type annotation.

### [Globbed Imports](https://pkl-lang.org/main/current/language-reference/index.html#globbed-imports)

Multiple modules may be imported at once with `import*`.<br/>
When importing multiple modules, a glob pattern is used to match against existing resources.<br/>
A globbed import evaluates to a `Mapping`, where keys are the expanded form of the glob and values are import expressions on each individual module.

Globbed imports can be expressed as either a clause or as an expression.<br/>
When expressed as a clause, they follow the same naming rules as a normal [import clause](https://pkl-lang.org/main/current/language-reference/index.html#import-clause): they introduce a local property equal to the last path segment without the `.pkl` extension.<br/>
A globbed import clause cannot be used as a type.

```pkl hljs
import* "birds/*.pkl" as allBirds (1)
import* "reptiles/*.pkl" (2)

birds = import*("birds/*.pkl") (3)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                                                           |
| ----- | ------------------------------------------------------------------------- |
| **1** | Globbed import clause                                                     |
| **2** | Globbed import clause without an explicit name (will import the name `*`) |
| **3** | Globbed import expression                                                 |

Assuming that a file system contains these files:

```txt hljs
.
├── birds/
│  ├── pigeon.pkl
│  ├── parrot.pkl
│  └── falcon.pkl
└── index.pkl
```

txt![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

The following two snippets are logically identical:

index.pkl

```pkl hljs
birds = import*("birds/*.pkl")
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

index.pkl

```pkl hljs
birds = new Mapping {
  ["birds/pigeon.pkl"] = import("birds/pigeon.pkl")
  ["birds/parrot.pkl"] = import("birds/parrot.pkl")
  ["birds/falcon.pkl"] = import("birds/falcon.pkl")
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

By default, only the `file` and `package` schemes are globbable.<br/>
Globbing another scheme will cause Pkl to throw.

Pkl can be extended to provide custom globbable schemes through the [ModuleKey](https://github.com/apple/pkl/tree/0.28.1/pkl-core/src/main/java/org/pkl/core/module/ModuleKey.java)<br/>
SPI.

When globbing within [packages](https://pkl-lang.org/main/current/language-reference/index.html#package-asset-uri), only the asset path (the fragment section) is globbable.<br/>
Otherwise, characters are interpreted verbatim, and not treated as glob wildcards.

For details on how glob patterns work, refer to [Glob Patterns](https://pkl-lang.org/main/current/language-reference/index.html#glob-patterns) in the Advanced Topics section.

|     |                                                                                                                                                                                                |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     | When globbing files, symbolic links are not followed. Additionally, the `.` and `..` entries are skipped.<br>This behavior is similar to the behavior of Bash with `shopt -s dotglob` enabled. |

### [Security Checks](https://pkl-lang.org/main/current/language-reference/index.html#security-checks)

When attempting to directly evaluate a module, as in `pkl eval myModule.pkl`,<br/>
the following security checks are performed:

- The module URI is checked against the module allowlist (`--allowed-modules`).

The module allowlist is a comma-separated list of regular expressions.<br/>
For access to be granted, at least one regular expression must match a prefix of the module URI.<br/>
For example, the allowlist `file:,https:` grants access to any module whose URI starts with `file:` or `https:`.

curity checks are performed:

- The target module URI is checked against the module allowlist (`--allowed-modules`).
- The source and target modules' _trust levels_ are determined and compared.

For access to be granted, the source module's trust level must be greater than or equal to the target module's trust level.<br/>
By default, there are five trust levels, listed from highest to lowest:

1. `repl:` modules (code evaluated in the REPL)
2. `file:` modules
3. `modulepath:` modules
4. All other modules (for example `https:`)
5. `pkl:` modules (standard library)

For example, this means that `file:` modules can import `https:` modules, but not the other way around.

ample of this is an HTTPS URL that results in a redirect.

Pkl embedders can further customize security checks.

### [Module Output](https://pkl-lang.org/main/current/language-reference/index.html#module-output)

By default, the output of evaluating a module is the entire module rendered as Pcf.<br/>
There are two ways to change this behavior:

1. _Outside_ the language, by using the `--format` CLI option or the `outputFormat` Gradle task property.<br/>
   /current/language-reference/index.html\#cli)

Given the following module:

config.pkl

```pkl hljs
a = 10
b {
  c = 20
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

`pkl eval config.pkl`, which is shorthand for `pkl eval --format pcf config.pkl`, renders the module as Pcf:

```pkl hljs
a = 10
b {
  c = 20
}
```

!

`pkl eval --format yaml config.pkl` renders the module as YAML:

```yaml hljs
a: 10
b:
  c: 20
```

yaml![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Likewise, `pkl eval --format json config.pkl` renders the module as JSON.

#### [In-language](https://pkl-lang.org/main/current/language-reference/index.html#in-language)

Now let's do the same — and more — inside the language.

Modules have an [output](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Module#output) property that controls what the module's output is and how that output is rendered.

To control **what** the output is, set the [output.value](https://pkl-lang.org/package-docs/pkl/0.28.1/base/ModuleOutput#value) property:

```pkl hljs
a = 10
b {
  c = 20
}
output {
  value = b // defaults to `outer`, which is the entire module
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

This produces:

```pkl hljs
c = 20
```

!

To control _how_ the output is rendered, set the [output.renderer](https://pkl-lang.org/package-docs/pkl/0.28.1/base/ModuleOutput#renderer) property:

```pkl hljs
a = 10
b {
  c = 20
}

output {
  renderer = new YamlRenderer {}
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

The standard library provides these renderers:

- [JsonRenderer](https://pkl-lang.org/package-docs/pkl/0.28.1/base/JsonRenderer)
- [jsonnet.Renderer](https://pkl-lang.org/package-docs/pkl/0.28.1/jsonnet/Renderer)
- [PcfRenderer](https://pkl-lang.org/package-docs/pkl/0.28.1/base/PcfRenderer)<br/>
  <tps://pkl-lang.org/package-docs/pkl/0.28.1/base/PropertiesRenderer>)
- [protobuf.Renderer](https://pkl-lang.org/package-docs/pkl/0.28.1/protobuf/Renderer)
- [xml.Renderer](https://pkl-lang.org/package-docs/pkl/0.28.1/xml/Renderer)
- [YamlRenderer](https://pkl-lang.org/package-docs/pkl/0.28.1/base/YamlRenderer)

To render a format that is not yet supported, you can implement your own renderer by extending the class [ValueRenderer](https://pkl-lang.org/package-docs/pkl/0.28.1/base/ValueRenderer).

The standard library renderers can be configured with _value converters_, which influence how particular values are rendered.

For example, since YAML does not have a standard way to represent data sizes, a plain `YamlRenderer` cannot render `DataSize` values.<br/>
However, we can teach it to:

```pkl hljs
quota {
  memory = 100.mb
  disk = 20.gb
}

.unit)"
    }
  }
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

This produces:

```yaml hljs
quota:
  memory: 100 MB
  disk: 20 GB
```

yaml![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

In addition to _class_-based converters, renderers also support _path_-based converters:

```pkl hljs
output {
  renderer = new YamlRenderer {
    converters {
      ["quota.memory"] = (size) -> "\(size.value) \(size.unit)"
      ["quota.disk"] = (size) -> "\(size.value) \(size.unit)"
    }
  }
}
```

!

For more on path-based converters, see [PcfRenderer.converters](https://pkl-lang.org/package-docs/pkl/0.28.1/base/PcfRenderer#converters).

Sometimes it is useful to directly compute the final module output, bypassing `output.value` and `output.converters`.<br/>
To do so, set the [output.text](https://pkl-lang.org/package-docs/pkl/0.28.1/base/ModuleOutput#text) property to a String value:

```pkl hljs
output {
  // defaults to `renderer.render(value)`
  text = "this is the final output".toUpperCase()
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

This produces:

```none hljs
THIS IS THE FINAL OUTPUT
```

![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

#### [Multiple File Output](https://pkl-lang.org/main/current/language-reference/index.html#multiple-file-output)

It is sometimes desirable for a single module to produce multiple output files.<br/>
This is possible by configuring a module's [`output.files`](https://pkl-lang.org/package-docs/pkl/0.28.1/base/ModuleOutput#files) property<br/>
and specifying the [`--multiple-file-output-path`](https://pkl-lang.org/main/current/pkl-cli/index.html#multiple-file-output-path)<br/>
(or `-m` for short) CLI option.

diet = "Seeds"<br/>
}<br/>
parrot {<br/>
name = "Parrot"<br/>
diet = "Seeds"<br/>
}<br/>
output {<br/>
files {<br/>
["birds/pigeon.json"] {<br/>
value = pigeon
renderer = new JsonRenderer {}
}
["birds/parrot.yaml"] {
value = parrot
renderer = new YamlRenderer {}
}
}
}

```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!
json hljs
{
  "name": "Pigeon",
  "diet": "Seeds"
}
```

json![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

output/birds/parrot.yaml
ference/img/octicons-16.svg#view-clippy)Copied!

Within `output.files`,<br/>
a key determines a file's path relative to `--multiple-file-output-path`,<br/>
and a value determines the file's contents.<br/>
If a file's path resolves to a location outside `--multiple-file-output-path`,<br/>
evaluation fails with an error.<br/>
Non-existing parent directories are created.

##### [Aggregating Module Outputs](https://pkl-lang.org/main/current/language-reference/index.html#aggregating-module-outputs)

outputs of multiple other modules.<br/>
Here is an example:

pigeon.pkl

````pkl hljs
name = "Pigeon"
diet = "Seeds"
output {
  renderer = new JsonRenderer {}
Copied!

parrot.pkl

```pkl hljs
name = "Parrot"
diet = "Seeds"
output {
  renderer = new YamlRenderer {}
}
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

birds.pkl

```pkl hljs
import "pigeon.pkl"
import "parrot.pkl"


```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     | When aggregating module outputs,<br>the appropriate file extensions can be obtained programmatically:<br>birds.pkl<br>`pkl hljs<br>import "pigeon.pkl"<br>import "parrot.pkl"<br>output {<br>  files {<br>    ["birds/pigeon.\(pigeon.output.renderer.extension)"] = pigeon.output<br>    ["birds/parrot.\(parrot.output.renderer.extension)"] = parrot.output<br>  }<br>}<br>`<br>pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied! |

## [Null Values](https://pkl-lang.org/main/current/language-reference/index.html#null-values)

The keyword `null` indicates the absence of a value.<br/>
`null` is an instance of [Null](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Null), a direct subclass of `Any`.

### [Non-Null Operator](https://pkl-lang.org/main/current/language-reference/index.html#non-null-operator)

The `!!` (non-null) operator asserts that its operand is non-null.<br/>
name2!! (2)

````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | result: `"Pigeon"` |
| **2** | result: _Error: Expected a non-null value, but got `null`._ |

### [Null Coalescing](https://pkl-lang.org/main/current/language-reference/index.html\#null-coalescing)

The `??` (null coalescing) operator fills in a default for a `null` value.

```pkl expression hljs
value ?? default
````

pkl expression![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

The above expression evaluates to `value` if `value` is non-null, and to `default` otherwise.<br/>
Here are some examples:
rrot" (2)

````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | result: `"Pigeon"` |
| **2** | result: `"Parrot"` |

|     |     |
| --- | --- |
|  | Default non-null behavior<br>Many languages allow `null` for (almost) every type, but Pkl does not.<br>Any type can be extended to include `null` by appending `?` to the type.<br>For example, `parrot: Bird` will always be non-null, but `pigeon: Bird?` could be `null` \- and _is_ by default,<br>if `pigeon` is never amended. This means if you try to coalesce a (non-nullable) typed variable,<br>the result is always that variable's value.<br>As per our example `parrot?? pigeon == parrot` always holds,<br>but `pigeon?? parrot` could either be `pigeon` or `parrot`,<br>depending on whether `pigeon` was ever amended with a non-null value. |

### [Null Propagation](https://pkl-lang.org/main/current/language-reference/index.html\#null-propagation)

The `?.` (null propagation) operator provides null-safe access to a member whose receiver may be `null`.

```pkl expression hljs
value?.member
````

pkl expression![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

The above expression evaluates to `value.member` if `value` is non-null, and to `null` otherwise.<br/>
Here are some examples:

```pkl hljs
name = "Pigeon"
me2?.length        (3)
name2Upper = name2?.toUpperCase()  (4)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                    |
| ----- | ------------------ |
| **1** | result: `6`        |
| **2** | result: `"PIGEON"` |
| **3** | result: `null`     |
| **4** | result: `null`     |

````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | result: `0` |

### [ifNonNull Method](https://pkl-lang.org/main/current/language-reference/index.html\#ifnonnull-method)

The [ifNonNull()](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Null#ifNonNull()) method is a generalization of the [null propagation](https://pkl-lang.org/main/current/language-reference/index.html#null-propagation) operator.

```pkl expression hljs
name.ifNonNull((it) -> doSomethingWith(it))
````

pkl expression![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

The above expression evaluates to `doSomethingWith(name)` if `name` is non-null, and to `null` otherwise.<br/>
Here are some examples:

```pkl hljs
name = "Pigeon"
nameWithTitle = name.ifNonNull((it) -> "Dr." + it)  (1)

name2 = null
name2WithTitle = name2.ifNonNull((it) -> "Dr." + it) (2)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                        |
| ----- | ---------------------- |
| **1** | result: `"Dr. Pigeon"` |
| **2** | result: `null`         |

### [NonNull Type Alias](https://pkl-lang.org/main/current/language-reference/index.html#nonnull-type-alias)

To express that a property can have any type except `Null`, use the `NonNull` [type alias](https://pkl-lang.org/main/current/language-reference/index.html#type-aliases):

```pkl hljs
x: NonNull
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

## [If Expressions](https://pkl-lang.org/main/current/language-reference/index.html#if-expressions)

An `if` expression serves the same role as the ternary operator (`?:`) in other languages.<br/>
Every `if` expression must have an `else` branch.

```pkl hljs
num = if (2 + 2 == 5) 1984 else 42 (1)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |              |
| ----- | ------------ |
| **1** | result: `42` |

## [Resources](https://pkl-lang.org/main/current/language-reference/index.html#resources)

Pkl programs can read external resources, such as environment variables or text files.

To read a resource, use a `read` expression:

```pkl hljs
path = read("env:PATH")
```

By default, the following resource URI schemes are supported:

env:

Reads an environment variable.<br/>
Result type is `String`.

prop:

ds a file from the file system.<br/>
Result type is [Resource](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Resource).

http(s):

Reads an HTTP(S) resource.<br/>
Result type is [Resource](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Resource).

modulepath:

Reads a resource from the module path (`--module-path`) or JVM class path.<br/>
Result type is [Resource](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Resource).<br/>
See [Module Path URI](https://pkl-lang.org/main/current/language-reference/index.html#module-path-uri) for further information.

package:

Reads a resource from a _package_. Result type is [Resource](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Resource). See [Package asset URI:](https://pkl-lang.org/main/current/language-reference/index.html#package-asset-uri) for further information.

Relative resource URIs are resolved against the enclosing module's URI.

Resources are cached in memory on the first read.<br/>
Therefore, subsequent reads are guaranteed to return the same result.

### [Nullable Reads](https://pkl-lang.org/main/current/language-reference/index.html#nullable-reads)

If a resource does not exist or cannot be read, `read()` fails with an error.<br/>
To recover from the absence of a resource, use `read?()` instead,<br/>
which returns `null` for absent resources:

```pkl hljs
port = read?("env:PORT")?.toInt() ?? 1234
```

!

### [Globbed Reads](https://pkl-lang.org/main/current/language-reference/index.html#globbed-reads)

Multiple resources may be read at the same time with `read*()`.<br/>
When reading multiple resources, a glob pattern is used to match against existing resources.<br/>
A globbed read returns a `Mapping`, where the keys are the expanded form of the glob, and values are `read` expressions on each individual resource.

pkl
│ └── falcon.pkl
└── index.pkl

````

txt![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

The following two snippets are logically identical:

index.pkl

```pkl hljs
birdFiles = read*("birds/*.pkl")
````

index.pkl

```pkl hljs
birdFiles = new Mapping {
  ["birds/pigeon.pkl"] = read("birds/pigeon.pkl")
  ["birds/parrot.pkl"] = read("birds/parrot.pkl")
  ["birds/falcon.pkl"] = read("birds/falcon.pkl")
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

By default, the following schemes support globbing:

- `modulepath`
- `file`
- `env`
- `prop`

Globbing other resources results in an error.

For details on how glob patterns work, reference [Glob Patterns](https://pkl-lang.org/main/current/language-reference/index.html#glob-patterns) in the Advanced Topics section.

|     |                                                                                                                                                                                                |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     | When globbing files, symbolic links are not followed. Additionally, the `.` and `..` entries are skipped.<br>This behavior is similar to the behavior of Bash with `shopt -s dotglob` enabled. |

|     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     | The `env` and `prop` schemes are considered opaque, as they do not have traditional hierarchical elements like a host, path, or query string.<br>While globbing is traditionally viewed as a way to match elements in a file system, a glob pattern is simply a way to match strings.<br>Thus, environment variables and external properties can be globbed, where their names get matched according to the rules described by the glob pattern.<br>To match all values within these schemes, use the `**` wildcard.<br>This has the effect of matching names that contain a forward slash too (`/`).<br>For example, the expression `read*("env:**")` will evaluate to a Mapping of all environment variables. |

### [Extending resource readers](https://pkl-lang.org/main/current/language-reference/index.html#extending-resource-readers)

dded into a JVM application, new resources may be read by implementing the [ResourceReader](https://github.com/apple/pkl/tree/0.28.1/pkl-core/src/main/java/org/pkl/core/resource/ResourceReader.java) SPI.<br/>
When Pkl is embedded within Swift, new resources may be read by implementing the [ResourceReader](https://github.com/apple/pkl-swift/blob/main/Sources/PklSwift/Reader.swift) interface.<br/>
When Pkl is embedded within Go, new resources may be read by implementing the [ResourceReader](https://github.com/apple/pkl-go/blob/main/pkl/reader.go) interface.

### [Resource Allowlist](https://pkl-lang.org/main/current/language-reference/index.html#resource-allowlist)

When attempting to read a resource, the resource URI is checked against the resource allowlist (`--allowed-resources`).<br/>
In embedded mode, the allowlist is configured via an evaluator's [SecurityManager](https://github.com/apple/pkl/tree/0.28.1/pkl-core/src/main/java/org/pkl/core/SecurityManager.java).

The resource allowlist is a comma-separated list of regular expressions.<br/>
For access to be granted, at least one regular expression must match a prefix of the resource URI.<br/>
For example, the allowlist `file:,https:` grants access to any resource whose URI starts with `file:` or `https:`.

## [Errors](https://pkl-lang.org/main/current/language-reference/index.html#errors)

By design, errors are fatal in Pkl — there is no way to recover from them.<br/>
To raise an error, use a `throw` expression:

```pkl hljs
myValue = throw("You won't be able to recover from this one!") (1)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

| | |
printed to the console and the program exits.<br/>
In embedded mode, a [PklException](https://github.com/apple/pkl/tree/0.28.1/pkl-core/src/main/java/org/pkl/core/PklException.java) is thrown.

## [Debugging](https://pkl-lang.org/main/current/language-reference/index.html#debugging)

When debugging Pkl code, it can be useful to print the value of an expression.<br/>
To do so, use a `trace` expression:

```pkl hljs
num1 = 42
num2 = 16
res = trace(num1 * num2)
```

Tracing an expression does not affect its result, but prints both its source code and result on standard error:

```shell hljs
pkl: TRACE: num1 * num2 = 672 (at file:///some/module.pkl, line 42)
```

shell![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

## [Advanced Topics](https://pkl-lang.org/main/current/language-reference/index.html#advanced-topics)

This section discusses language features that are generally more relevant to template and library authors than template consumers.

[Meaning of `new`](https://pkl-lang.org/main/current/language-reference/index.html#meaning-of-new)

[Let Expressions](https://pkl-lang.org/main/current/language-reference/index.html#let-expressions)

[Type Tests](https://pkl-lang.org/main/current/language-reference/index.html#type-tests)

[Type Casts](https://pkl-lang.org/main/current/language-reference/index.html#type-casts)

[Lists](https://pkl-lang.org/main/current/language-reference/index.html#lists)

[Sets](https://pkl-lang.org/main/current/language-reference/index.html#sets)

[Maps](https://pkl-lang.org/main/current/language-reference/index.html#maps)

[Regular Expressions](https://pkl-lang.org/main/current/language-reference/index.html#regular-expressions)

[Type Aliases](https://pkl-lang.org/main/current/language-reference/index.html#type-aliases)

[Type Annotations](https://pkl-lang.org/main/current/language-reference/index.html#type-annotations)

[Anonymous Functions](https://pkl-lang.org/main/current/language-reference/index.html#anonymous-functions)

[Amending Null Values](https://pkl-lang.org/main/current/language-reference/index.html#amend-null)

[When Generators](https://pkl-lang.org/main/current/language-reference/index.html#when-generators)

[For Generators](https://pkl-lang.org/main/current/language-reference/index.html#for-generators)

[Spread Syntax](https://pkl-lang.org/main/current/language-reference/index.html#spread-syntax)

cates)

[`this` Keyword](https://pkl-lang.org/main/current/language-reference/index.html#this-keyword)

[`outer` Keyword](https://pkl-lang.org/main/current/language-reference/index.html#outer-keyword)

[`super` Keyword](https://pkl-lang.org/main/current/language-reference/index.html#super-keyword)

[`module` Keyword](https://pkl-lang.org/main/current/language-reference/index.html#module-keyword)

[Glob Patterns](https://pkl-lang.org/main/current/language-reference/index.html#glob-patterns)

[Doc Comments](https://pkl-lang.org/main/current/language-reference/index.html#doc-comments)

[Name Resolution](https://pkl-lang.org/main/current/language-reference/index.html#name-resolution)

[Reserved Keywords](https://pkl-lang.org/main/current/language-reference/index.html#reserved-keywords)

[Blank Identifiers](https://pkl-lang.org/main/current/language-reference/index.html#blank-identifiers)

[Projects](https://pkl-lang.org/main/current/language-reference/index.html#projects)

[External Readers](https://pkl-lang.org/main/current/language-reference/index.html#external-readers)

### [Meaning of `new`](https://pkl-lang.org/main/current/language-reference/index.html#meaning-of-new)

Objects in Pkl always [amends](https://pkl-lang.org/main/current/language-reference/index.html#amending-objects) _some_ value.<br/>
The `new` keyword is a special case of amending where a contextual value is amended.<br/>
In Pkl, there are two forms of `new` objects:

- `new` with explicit type information, for example, `new Foo {}`.
- `new` without type information, for example, `new {}`.

#### [Type defaults](https://pkl-lang.org/main/current/language-reference/index.html#type-defaults)

To understand instantiation cases without explicit parent or type information, it's important to first understand implicit default values.<br/>
When a property is declared in a module or class but is not provided an explicit default value, the property's default value becomes the type's default value.<br/>
Similarly, when `Listing` and `Mapping` types are declared with explicit type arguments for their element or value, their `default` property amends that declared type.<br/>
When `Listing` and `Mapping` types are declared without type arguments, their `default` property amends an empty `Dynamic` object.<br/>
Some types, including `Pair` and primitives like `String`, `Number`, and `Boolean` have no default value; attempting to render such a property results in the error "Tried to read property `<name>` but its value is undefined".

```pkl hljs
class Bird {
  name: String = "polly"
}

bird: Bird (1)
org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | Without an explicit default value, this property has default value `new Bird { name = "polly" }` |
| **2** | With an explicit element type argument, this property's default value is equivalent to `new Listing<Bird> { default = (_) → new Bird { name = "polly" } }` |
| **3** | With an explicit value type argument, this property's default value is equivalent to `new Mapping<String, Bird> { default = (_) → new Bird { name = "polly" } }` |

#### [Explicitly Typed `new`](https://pkl-lang.org/main/current/language-reference/index.html\#explicitly-typed-new)

Instantiating an object with `new <type>` results in a value that amends the specified type's default value.<br/>
Notably, creating a `Listing` element or assigning a `Mapping` entry value with an explicitly typed `new` ignores the object's `default` value.
 not.
  isPredatory: Boolean?
}

newProperty = new Bird { (1)
  name = "Warbler"
}

someListing = new Listing<Bird> {
  default {
    isPredatory = true
  }
  new Bird { (2)
    name = "Sand Piper"
  }
}
 (3)
    name = "Penguin"
  }
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                                                                                                                                                                                                                                                  |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1** | Assigning a `new` explicitly-typed value to a property.                                                                                                                                                                                                          |
| **2** | Adding an `new` explicitly-typed `Listing` element.<br>The value will not have property `isPredatory = true` as the `default` property of the `Listing` is not ped `new`](https://pkl-lang.org/main/current/language-reference/index.html\#implicitly-typed-new) |

When using the implicitly typed `new` invocation, there is no explicit parent value to amend.<br/>
In these cases, Pkl infers the amend operation's parent value based on context:

- When assigning to a declared property, the property's default value is amended ([including `null`](https://pkl-lang.org/main/current/language-reference/index.html#amend-null)).<br/>
  If there is no type associated with the property, an empty `Dynamic` object is amended.

- When assigning to an entry (e.g. a `Mapping` member) or element (e.g. a `Listing` member), the enclosing object's `default` property is applied to the corresponding index or key, respectively, to produce the value to be amended.
- In other cases, evaluation fails with the error message "Cannot tell which parent to amend".

The type annotation of a [method](https://pkl-lang.org/main/current/language-reference/index.html#methods) parameter is not used for inference.<br/>
In this case, the argument's type should be specified explicitly.
= new {
for (item in items) {
"\(name):\(item)"
}
}
}

typedProperty: Bird = new { (1)
name = "Swift"
}

untypedProperty = new { (2)
hello = "world"
}

typedListing: Listing<Bird> = new {
new { (3)
name = "Kite"
}
}

untypedListing: Listing = new {
new { (4)
hello = "there"
}
}

typedMapping: Mapping<String, Bird> = new {
Sparrow"
}
}

amendedMapping = (typedMapping) {
["Saltmarsh Sparrow"] = new {} (6)
}

class Aviary {
birds: Listing<Bird> = new {
new { name = "Osprey" }
}
}

aviary: Aviary = new {
birds = new { (7)
new { name = "Kiwi" }
}
}

swiftHatchlings = typedProperty.listHatchlings(new { "Poppy"; "Chirpy" }) (8)

````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | Assignment to a property with an explicitly declared type, amending `new Bird {}`. |
| **2** | Assignment to an undeclared property in module context, amending `new Dynamic {}`. |
| **3** | `Listing` element creation, amending implicit `default`, `new Bird {}`. |
| **4** | `Listing` element creation, amending implicit `default`, `new Dynamic {}`. |
| **5** | `Mapping` value assignment, amending the result of applying `default` to `"Saltmarsh Sparrow"`, `new Bird { name = "Saltmarsh Sparrow" }`. |
| **6** | `Mapping` value assignment _replacing_ the parent's entry, amending the result of applying `default` to `"Saltmarsh Sparrow"`, `new Bird { name = "Saltmarsh Sparrow" }`. |
| **7** | Amending the property default value `new Listing { new Bird { name = "Osprey" } }`; the result contains both birds. |
nt/language-reference/index.html\#let-expressions)

A `let` expression is Pkl's version of an (immutable) local variable.<br/>
Its syntax is:

```none hljs
let (<name> = <value>) <expr>
````

![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

A `let` expression is evaluated as follows:

1. `<name>` is bound to `<value>`, itself an expression.
2. `<expr>` is evaluated, which can refer to `<value>` by its `<name>` (this is the point).
3. The result of <expr> becomes the result of the overall expression.
   s[2], diets[0]) (1)

````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | result: `birdDiets = List("Mice", "Seeds")` |

`let` expressions serve two purposes:

- They introduce a human-friendly name for a potentially complex expression.
- They evaluate a potentially expensive expression that is used in multiple places only once.

`let` expressions can have type annotations:

```pkl hljs
birdDiets =
  let (diets: List<String> = List("Seeds", "Berries", "Mice"))
    diets[2] + diets[0] (1)
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                             |
| ----- | ------------------------------------------- |
| **1** | result: `birdDiets = List("Mice", "Seeds")` |

t"))
let (diet = List("Seeds", "Mice", "Berries"))
birds.zip(diet) (1)

````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | result: `birdDiets = List(Pair("Pigeon", "Seeds"), Pair("Barn owl", "Mice"), Pair("Parrot", "Berries"))` |

### [Type Tests](https://pkl-lang.org/main/current/language-reference/index.html\#type-tests)

To test if a value conforms to a type, use the _is_ operator.

!(42 is String)

open class Base
class Derived extends Base

base = new Base {}

test5 = base is Base
test6 = base is Any
test7 = !(base is Derived)

l![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

A value can be tested against any type, not just a class:

```pkl hljs
test1 = email is String(contains("@")) (1)
test2 = map is Map<Int, Base> (2)
test3 = name is "Pigeon"|"Barn owl"|"Parrot" (3)
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                                               |
| ----- | ------------------------------------------------------------- |
| **1** | `email` is tested for being a string that contains a `@` sign |
| **2** | `map` is tested for being a map from `Int` to `Base` values   |

s://pkl-lang.org/main/current/language-reference/index.html\#type-casts)

The _as_ (type cast) operator performs a runtime type check on its operand.<br/>
If the type check succeeds, the operand is returned as-is; otherwise, an error is thrown.

```pkl hljs
birds {
  new { name = "Pigeon" }
  new { name = "Barn owl" }
}
names = birds.toList().map((it) -> it.name) as List<String>
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Although type casts are never mandatory in Pkl, they occasionally help humans and tools better understand an expression's type.

### [Lists](https://pkl-lang.org/main/current/language-reference/index.html#lists)

A value of type [List](https://pkl-lang.org/package-docs/pkl/0.28.1/base/List) is an ordered, indexed collection of _elements_.

A list's elements have zero-based indexes and are eagerly evaluated.

|     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|     | When to use List vs. [Listing](https://pkl-lang.org/main/current/language-reference/index.html#listings)<br>- When a collection of elements needs to be specified literally, use a listing.<br> <br>- When a collection of elements needs to be transformed in a way that cannot be achieved by [amending](https://pkl-lang.org/main/current/language-reference/index.html#amending-listings) a listing, use a list.<br> <br>- If in doubt, use a listing.<br> <br>Templates and schemas should almost always use listings instead of lists.<br>Note that listings can be converted to lists when the need arises. |

Lists are constructed with the `List()` method\[[5](https://pkl-lang.org/main/current/language-reference/index.html#_footnotedef_5 "View footnote.")\]:

```pkl hljs
list1 = List() (1)
list2 = List(1, 2, 3) (2)
list3 = List(1, "x", 5.min, List(1, 2, 3)) (3)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                                               |
| ----- | ------------------------------------------------------------- |
| **1** | result: empty list                                            |
| **2** | result: list of length 3                                      |
| **3** | result: heterogeneous list whose last element is another list |

To concatenate lists, use the `+` operator:

```pkl expression hljs
List(1, 2) + List(3, 4) + List(5)
```

ppy)Copied!

To access a list element by index, use the `[]` (subscript) operator:

```pkl hljs
list = List(1, 2, 3, 4)
listElement = list[2] (1)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |             |
| ----- | ----------- |
| **1** | result: `3` |

Class `List` offers a [rich API](https://pkl-lang.org/package-docs/pkl/0.28.1/base/List).<br/>
Here are just a few examples:

```pkl hljs
list = List(1, 2, 3, 4)
res1 = list.contains(3) (1)
res2 = list.first (2)
res3 = list.rest (3)
res4 = list.reverse() (4)
res5 = list.drop(1).take(2) (5)
res6 = list.map((n) -> n * 3) (6)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!
, 4)`|
| **4** | result:`List(4, 3, 2, 1)`|
| **5** | result:`List(2, 3)`|
| **6** | result:`List(3, 6, 9, 12)` |

### [Sets](https://pkl-lang.org/main/current/language-reference/index.html#sets)

A value of type [Set](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Set) is a collection of unique _elements_.

Sets are constructed with the `Set()` method\[[5](https://pkl-lang.org/main/current/language-reference/index.html#_footnotedef_5 "View footnote.")\]:

```pkl hljs
 (4)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                                                    |
| ----- | ------------------------------------------------------------------ |
| **1** | result: empty set                                                  |
| **2** | result: set of length 3                                            |
| **3** | result: same set of length 3                                       |
| **4** | result: heterogeneous set that contains a list as its last element |

Sets retain the order of elements when constructed, which impacts how they are iterated over.<br/>
However, this order is not considered when determining equality of two sets.

```pkl hljs
res1 = Set(4, 3, 2)
res2 = res1.first (1)
res3 = res1.toListing() (2)
res4 = Set(2, 3, 4) == res1 (3)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                   |
| ----- | --------------------------------- |
| **1** | result: `4`                       |
| **2** | result: `new Listing { 4; 3; 2 }` |
| **3** | result: `true`                    |

To compute the union of sets, use the `+` operator:

```pkl expression hljs
Set(1, 2) + Set(2, 3) + Set(5, 3) (1)
```

pkl expression![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                           |
| ----- | ------------------------- |
| **1** | result: `Set(1, 2, 3, 5)` |

Class `Set` offers a [rich API](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Set).<br/>
Here are just a few examples:

```pkl hljs
set = Set(1, 2, 3, 4)
ect(Set(3, 9, 2)) (4)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                            |
| ----- | -------------------------- |
| **1** | result: `true`             |
| **2** | result: `Set(2, 3)`        |
| **3** | result: `Set(3, 6, 9, 12)` |
| **4** | result: `Set(3, 2)`        |

### [Maps](https://pkl-lang.org/main/current/language-reference/index.html#maps)

A value of type [Map](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Map) is a collection of _values_ indexed by _key_.

A map's key-value pairs are called its _entries_.<br/>
Keys and values are eagerly evaluated.

| | |
html#mappings)<br>- When key-value style data needs to be specified literally, use a mapping.<br> <br>- When key-value style data needs to be transformed in ways that cannot be achieved by [amending](https://pkl-lang.org/main/current/language-reference/index.html#amending-mappings) a mapping, use a map.<br> <br>- If in doubt, use a mapping.<br> <br>Templates and schemas should almost always use mappings instead of maps.<br>(Note that mappings can be converted to maps when the need arises.) |

Maps are constructed by passing alternating keys and values to the `Map()` method\[[5](https://pkl-lang.org/main/current/language-reference/index.html#_footnotedef_5 "View footnote.")\]:

```pkl hljs
map1 = Map() (1)
map2 = Map(1, "one", 2, "two", 3, "three") (2)
map3 = Map(1, "x", 2, 5.min, 3, Map(1, 2)) (3)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                                           |
| ----- | --------------------------------------------------------- |
| **1** | result: empty map                                         |
| **2** | result: set of length 3                                   |
| **3** | result: heterogeneous map whose last value is another map |

Any Pkl value can be used as a map key:

```pkl expression hljs
Map(new Dynamic { name = "Pigeon" }, 10.gb)
```

pkl expression![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Maps retain the order of entries when constructed, which impacts how they are iterated over.<br/>
However, this order is not considered when determining equality of two maps.

```pkl hljs
res1 = Map(2, "hello", 1, "world")
res2 = res1.entries.first (1)
res3 = res1.toMapping() (2)
res4 = res1 == Map(1, "world", 2, "hello") (3)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                                        |
| ----- | ------------------------------------------------------ |
| **1** | result: `Pair(2, "hello")`                             |
| **2** | result: `new Mapping { [2] = "hello"; [1] = "world" }` |
| **3** | result: `true`                                         |

To merge maps, use the `+` operator:

```pkl hljs
combinedMaps = Map(1, "one") + Map(2, "two", 1, "three") + Map(4, "four") (1)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                                |
| ----- | ---------------------------------------------- |
| **1** | result: `Map(1, "three", 2, "two", 4, "four")` |

To access a value by key, use the `[]` (subscript) operator:

```pkl hljs
map = Map("Pigeon", 5.gb, "Parrot", 10.gb)
parrotValue = map["Parrot"] (1)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                 |
| ----- | --------------- |
| **1** | result: `10.gb` |

Class `Map` offers a [rich API](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Map).<br/>
Here are just a few examples:

```pkl hljs
map = Map("Pigeon", 5.gb, "Parrot", 10.gb)
res1 = map.containsKey("Parrot") (1)
res2 = map.containsValue(8.gb) (2)
res3 = map.isEmpty (3)
res4 = map.length (4)
res5 = map.getOrNull("Falcon") (5)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                 |
| ----- | --------------- |
| **1** | result: `true`  |
| **2** | result: `false` |
| **3** | result: `false` |
| **4** | result: `2`     |
| **5** | result: `null`  |

### [Regular Expressions](https://pkl-lang.org/main/current/language-reference/index.html#regular-expressions)

A value of type [Regex](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Regex) is a regular expression with the same syntax and semantics as a [Java regular expression](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html).

gex()) method:

```pkl hljs
emailRegex = Regex(#"([\w\.]+)@([\w\.]+)"#)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Notice the use of custom string delimiters `#"` and `"#`, which change the string's escape character from `\` to `\#`.<br/>
As a consequence, the regular expression's backslash escape character no longer requires escaping.

To test if a string fully matches a regular expression, use [String.matches()](<https://pkl-lang.org/package-docs/pkl/0.28.1/base/String#matches()>):

```pkl expression hljs
"pigeon@example.com".matches(emailRegex)
```

pkl expression![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Many `String` methods accept either a `String` or `Regex` argument.<br/>
Here is an example:

```pkl hljs
res1 = "Pigeon<pigeon@example.com>".contains("pigeon@example.com")
res2 = "Pigeon<pigeon@example.com>".contains(emailRegex)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

To find all matches of a regex in a string, use [Regex.findMatchesIn()](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Regex#match).<br/>
The result is a list of [RegexMatch](https://pkl-lang.org/package-docs/pkl/0.28.1/base/RegexMatch) objects containing details about each match:

```pkl hljs
matches = emailRegex.findMatchesIn("pigeon@example.com / falcon@example.com / parrot@example.com")
list1 = matches.drop(1).map((it) -> it.start) (1)
list2 = matches.drop(1).map((it) -> it.value) (2)
list3 = matches.drop(1).map((it) -> it.groups[1].value) (3)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                                                                  |
| ----- | -------------------------------------------------------------------------------- |
| **1** | result: `List(0, 19, 40)` (the entire match, `matches[0]`, was dropped)          |
| **2** | result: `List("pigeon@example.com", "falcon@example.com", "parrot@example.com")` |

anguage-reference/index.html\#type-aliases)

A _type alias_ introduces a new name for a (potentially complicated) type:

```pkl hljs
typealias EmailAddress = String(matches(Regex(#".+@.+"#)))
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Once a type alias has been defined, it can be used in type annotations:

```pkl hljs
email: EmailAddress = "pigeon@example.com"

emailList: List<EmailAddress> = List("pigeon@example.com", "parrot@example.com")
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

New type aliases can be defined in terms of existing ones:

```pkl hljs
typealias EmailList = List<EmailAddress>

emailList: EmailList = List("pigeon@example.com", "parrot@example.com")
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Type aliases can have type parameters:

```pkl hljs
typealias StringMap<Value> = Map<String, Value>

map: StringMap<Int> = Map("Pigeon", 42, "Falcon", 21)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Code generators have different strategies for dealing with type aliases:

- the [Java](https://pkl-lang.org/main/current/java-binding/codegen.html) code generator inlines them
- the [Kotlin](https://pkl-lang.org/main/current/kotlin-binding/codegen.html) code generator turns them into Kotlin type aliases.

Type aliases for unions of [String Literal Types](https://pkl-lang.org/main/current/language-reference/index.html#string-literal-types) are turned into enum classes by both code generators.

#### [Predefined Type Aliases](https://pkl-lang.org/main/current/language-reference/index.html#predefined-type-aliases)

The _pkl.base_ module defines the following type aliases:

- [Int8](https://pkl-lang.org/package-docs/pkl/0.28.1/base/#Int8) (-128 to 127)
- [Int16](https://pkl-lang.org/package-docs/pkl/0.28.1/base/#Int16) (-32,768 to 32,767)
- [Int32](https://pkl-lang.org/package-docs/pkl/0.28.1/base/#Int32) (-2,147,483,648 to 2,147,483,647)
- [UInt8](https://pkl-lang.org/package-docs/pkl/0.28.1/base/#UInt8) (0 to 255)
- [UInt16](https://pkl-lang.org/package-docs/pkl/0.28.1/base/#UInt16) (0 to 65,535)
- [UInt32](https://pkl-lang.org/package-docs/pkl/0.28.1/base/#UInt32) (0 to 4,294,967,295)
- [UInt](https://pkl-lang.org/package-docs/pkl/0.28.1/base/#UInt) (0 to 9,223,372,036,854,775,807)
- [Uri](https://pkl-lang.org/package-docs/pkl/0.28.1/base/#Uri) (any String value)

|     |                                                                                                |
| --- | ---------------------------------------------------------------------------------------------- |
|     | Note that `UInt` has the same maximum value as `Int`, half of what would normally be expected. |

The main purpose of the provided integer aliases is to enforce the range of an integer:

```pkl hljs
port: UInt16 = -1
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

This gives:

```shell hljs
Type constraint isBetween(0, 65535) violated.
Value: -1
```

shell![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

e/Number#isBetween) method:

```pkl hljs
port: Int(isBetween(0, 1023)) = 443
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|     |                                                                                                                                                      |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
|     | Remember that numbers are always instances of `Int` or `Float`.<br>Type aliases such as `UInt16` only check that numbers are within a certain range. |

The [Java](https://pkl-lang.org/main/current/java-binding/codegen.html) and [Kotlin](https://pkl-lang.org/main/current/kotlin-binding/codegen.html) code generators<br/>
map predefined type aliases to the most suitable Java and Kotlin types.<br/>
For example, `UInt8` is mapped to `java.lang.Byte` and `kotlin.Byte`, and `Uri` is mapped to `java.net.URI`.

### [Type Annotations](https://pkl-lang.org/main/current/language-reference/index.html#type-annotations)

Property and method definitions may optionally contain type annotations.<br/>
Type annotations serve the following purposes:

- Documentation<br/>
  \+ Type annotations help to document data models. They are included in any generated documentation.

- Validation<br/>
  \+ Type annotations are validated at runtime.

- Defaults<br/>
  \+ Type-annotated properties have [Default Values](https://pkl-lang.org/main/current/language-reference/index.html#default-values).

- Code Generation<br/>
  \+ Type annotations enable statically typed access to configuration data through code generation.

- Tooling<br/>
  \+ Type annotations enable advanced tooling features such as code completion in editors.

#### [Class Types](https://pkl-lang.org/main/current/language-reference/index.html#class-types)

y icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                                 |
| ----- | ----------------------------------------------- |
| **1** | Declares an instance property of type `String`. |
| **2** | Declares a module property of type `Bird`.      |

#### [Module Types](https://pkl-lang.org/main/current/language-reference/index.html#module-types)

Any module import can be used as type:

bird.pkl

```pkl hljs
name: String
lifespan: Int
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!
kl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                 |
| ----- | ------------------------------- |
| **1** | Guaranteed to amend _bird.pkl_. |

As a special case, the `module` keyword denotes the _enclosing_ module's type:

bird.pkl

```pkl hljs
name: String
lifespan: Int
friends: Listing<module>
```

!

pigeon.pkl

```pkl hljs
amends "bird.pkl"

name = "Pigeon"
lifespan = 8
friends {
  import("falcon.pkl") (1)
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                                                  |
| ----- | ---------------------------------------------------------------- |
| **1** | _falcon.pkl_ (not shown here) is guaranteed to amend _bird.pkl_. |

#### [Type Aliases](https://pkl-lang.org/main/current/language-reference/index.html#type-aliases-2)

Any [type alias](https://pkl-lang.org/main/current/language-reference/index.html#type-aliases) can be used as a type:

```pkl hljs
typealias EmailAddress = String(contains("@"))

email: EmailAddress (1)

emailList: List<EmailAddress> (2)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

s |
| **2** | equivalent to `emailList: List<String(contains("@"))>` for type checking purposes |

#### [Nullable Types](https://pkl-lang.org/main/current/language-reference/index.html#nullable-types)

Class types such as `Bird` (see above) do not admit `null` values.<br/>
To turn them into _nullable types_, append a question mark (`?`):

````pkl hljs
bird: Bird = null   (1)
ns-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | throws `Type mismatch: Expected a value of type Bird, but got null` |
| **2** | succeeds |

The only class types that admit `null` values despite not ending in `?` are `Any` and `Null`.<br/>
(`Null` is not very useful as a type because it _only_ admits `null` values.)<br/>
`Any?` and `Null?` are equivalent to `Any` and `Null`, respectively.<br/>
In some languages, nullable types are also known as _optional types_.

#### [Generic Types](https://pkl-lang.org/main/current/language-reference/index.html\#generic-types)

The following class types are _generic types_:

- `Pair`
- `Collection`
- `Listing`
- `List`
- `Mapping`
`

A generic type has constituent types written in angle brackets (`<>`):

```pkl hljs
pair: Pair<String, Bird>    (1)
coll: Collection<Bird>      (2)
list: List<Bird>            (3)
set: Set<Bird>              (4)
map: Map<String, Bird>      (5)
mapping: Mapping<String, Bird> (6)
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                                                                    |
| ----- | ---------------------------------------------------------------------------------- |
| **1** | a pair `String` and `Bird` as types for the first and second element, respectively |
| **2** | a collection of `Bird` elements                                                    |
| **3** | a list of `Bird` elements                                                          |
| **4** | a set of `Bird` elements                                                           |
| **5** | a map with `String` keys and `Bird` values                                         |

claring them as `unknown`:

```pkl hljs
pair: Pair       // equivalent to `Pair<unknown, unknown>`
coll: Collection // equivalent to `Collection<unknown>`
list: List       // equivalent to `List<unknown>`
set: Set         // equivalent to `Set<unknown>`
map: Map         // equivalent to `Map<unknown, unknown>`
mapping: Mapping    // equivalent to `Mapping<unknown, unknown>`
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

The `unknown` type is both a top and a bottom type.<br/>
When a static type analyzer encounters an expression of `unknown` type,<br/>
it backs off and trusts the user that they know what they are doing.

#### [Union Types](https://pkl-lang.org/main/current/language-reference/index.html#union-types)

A value of type `A | B`, read "A or B", is either a value of type `A` or a value of type `B`.

````pkl hljs
class Bird { name: String }
//pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

More complex union types can be formed:

```pkl hljs
foo: List<Boolean|Number|String>|Bird
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Union types have no implicit default values, but an explicit type can be chosen using a `*` marker:

```pkl hljs
foo: "a"|"b"       // undefined. Will throw an error if not amended
bar: "a"|*"b"      // default value will be taken from type "b"
baz: "a"|"b" = "a" // explicit value is given
qux: String|*Int   // default taken from Int, but Int has no default. Will throw if not amended
```

Union types often come in handy when writing schemas for legacy JSON or YAML files.

#### [String Literal Types](https://pkl-lang.org/main/current/language-reference/index.html#string-literal-types)

A string literal type admits a single string value:

```pkl hljs
diet: "Seeds"
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

While occasionally useful on their own,<br/>
string literal types are often combined with [Union Types](https://pkl-lang.org/main/current/language-reference/index.html#union-types) to form enumerated types:

```pkl hljs
diet: "Seeds"|"Berries"|"Insects"
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

To reuse an enumerated type, introduce a type alias:
rg/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

The Java and Kotlin code generators turn type aliases for enumerated types into enum classes.

#### [Nothing Type](https://pkl-lang.org/main/current/language-reference/index.html#nothing-type)

The `nothing` type is the bottom type of Pkl's type system, the counterpart of top type `Any`.

The bottom type is assignment-compatible with every other type, and no other type is assignment-compatible with it.

Being assignment-compatible with every other type may sound too good to be true, but there is a catch — the `nothing` type has no values!

Despite being a lonely type, `nothing` has practical applications.<br/>
For example, it is used in the standard library's `TODO()` method:

```pkl hljs
function TODO(): nothing = throw("TODO")
```

A `nothing` return type indicates that a method never returns normally but always throws an error.

#### [Unknown Type](https://pkl-lang.org/main/current/language-reference/index.html#unknown-type)

The `unknown` type \[[6](https://pkl-lang.org/main/current/language-reference/index.html#_footnotedef_6 "View footnote.")\] is `nothing`'s even stranger cousin: it is both a top and bottom type!<br/>
This makes `unknown` assignment-compatible with every other type, and every other type assignment-compatible with `unknown`.

When a static type analyzer encounters a value of `unknown` type,<br/>
it backs off and trusts the code's author to know what they are doing — for example, whether a method called on the value exists.

#### [Progressive Disclosure](https://pkl-lang.org/main/current/language-reference/index.html#progressive-disclosure)

In the spirit of [progressive disclosure](https://en.wikipedia.org/wiki/Progressive_disclosure), type annotations are optional in Pkl.<br/>
Omitting a type annotation is equivalent to specifying the type `unknown`:

```pkl hljs
lifespan = 42 (1)
map: Map (2)
function say(name) = name (3)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                                                                                                          |
| ----- | ------------------------------------------------------------------------------------------------------------------------ |
| **1** | shorthand for `lifespan: unknown = 42`<br>(As a dynamically typed language, Pkl does not try to statically infer types.) |
| **2** | shorthand for `map: Map<unknown, unknown> = Map()`                                                                       |
| **3** | shorthand for `function say(name: unknown): unknown = name`                                                              |

-annotated properties have implicit "empty" default values depending on their type:

```pkl hljs
class Bird

coll: Collection<Bird>         // = List() (1)
list: List<Bird>               // = List() (2)
set: Set<Bird>                 // = Set() (3)
map: Map<String, Bird>         // = Map() (4)
listing: Listing<Bird>         // = new Listing { default = (index) -> new Bird {} } (5)
mapping: Mapping<String, Bird> // = new Mapping { default = (key) -> new Bird {} } (6)
obj: Bird                      // = new Bird {} (7)
nullable: Bird?                // = Null(new Bird {}) (8)
union: *Bird|String            // = new Bird {} (9)
stringLiteral: "Pigeon"        // = "Pigeon" (10)
nullish: Null                  // = null (11)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|                                                     |                                                                                                                                                                           |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1**                                               | Properties of type `Collection` default to the empty list.                                                                                                                |
| **2**                                               | Properties of type `List` default to the empty list.                                                                                                                      |
| **3**                                               | Properties of type `Set` default to the empty set.                                                                                                                        |
| **4**                                               | Properties of type `Map` default to the empty map.                                                                                                                        |
| **5**                                               | Properties of type `Listing<X>` default to an empty listing whose default element is the default for `X`.                                                                 |
| **6**                                               | Properties of type `Mapping<X, Y>` default to an empty mapping whose default value is the default for `Y`.                                                                |
| ?`default to`Null(x)`where`x`is the default for`X`. |
| **9**                                               | Properties with a union type have no default value. By prefixing one of the types in a union with a `*`, the default of that type is chosen as the default for the union. |
| **10**                                              | Properties with a string literal type default to the type's only value.                                                                                                   |
| **11**                                              | Properties of type `Null` default to `null`.                                                                                                                              |

See [Amending Null Values](https://pkl-lang.org/main/current/language-reference/index.html#amend-null) for further information.

Properties of the following types do not have implicit default values:

- `abstract` classes, including `Any` and `NotNull`
- Union types, unless an explicit default is given by prefixing one of the types with `*`.
- `external` (built-in) classes, including:
- `String`
- `Boolean`
- `Int`
- `Float`
- `Duration`
- `DataSize`
- `Pair`
- `Regex`

Accessing a property that neither has an (implicit or explicit) default value nor has been overridden throws an error:

```pkl hljs
name: String
```

!

#### [Type Constraints](https://pkl-lang.org/main/current/language-reference/index.html#type-constraints)

A type may be followed by a comma-separated list of _type constraints_ enclosed in round brackets (`()`).<br/>
A type constraint is a boolean expression that must hold for the annotated element.<br/>
Type constraints enable advanced runtime validation that goes beyond the capabilities of static type checking.

````pkl hljs
class Bird {
  name: String(length >= 3)     //  (1)
  parent: String(this != name)  //  (2)
}

rg/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | Restricts `name` to have at least three characters. |
| **2** | The name of the bird (`this`) should not be the same as the name of the `parent`. |
| **3** | Note how `parent` is different from `name`. If they were the same, we would be thrown a constraint error. |

In the following example, we define a `Bird` with a name of only two characters.

```pkl hljs
pigeon: Bird = new {
  // fails the constraint because [name] is less than 3 characters
g#view-clippy)Copied!

Boolean expressions are convenient for ad-hoc type constraints.<br/>
Alternatively, type constraints can be given as lambda expressions accepting a single argument, namely the value to be validated.<br/>
This allows for the abstraction and reuse of type constraints.

```pkl hljs
class Project {
  local emailAddress = (str) -> str.matches(Regex(#".+@.+"#))
  email: String(emailAddress)
}

project: Project = new {
  email = "projectPigeon@example.com"
}
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!
t match the regular expression.
email = "projectPigeon-example.com"
}

````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

##### [Composite Type Constraints](https://pkl-lang.org/main/current/language-reference/index.html\#composite-type-constraints)

A composite type can have type constraints for the overall type, its constituent types, or both.

```pkl hljs
class Project {
  local emailAddress = (str) -> str.matches(Regex(#".+@.+"#))
  // constrain the nullable type's element type
  type: String(contains("source"))?
  // constrain the map type and its key/value types
  contacts: Map<String(!isEmpty), String(emailAddress)>(length <= 5)
}

[copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

### [Anonymous Functions](https://pkl-lang.org/main/current/language-reference/index.html\#anonymous-functions)

An _anonymous function_ is a function without a name.

Most modern general-purpose programming languages support anonymous functions,<br/>
under names such as _lamba expressions_, _arrow functions_, _function literals_, _closures_, or _procs_.

Anonymous functions have their own literal syntax:

```none hljs
() -> expr (1)
(param) -> expr (2)
(param1, param2, ..., paramN) -> expr (3)
````

![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|                             |     |
| --------------------------- | --- |
| parameter lambda expression |

Here is an example:

```pkl expression hljs
(n) -> n * 3
```

pkl expression![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

This anonymous function accepts a parameter named `n`, multiplies it by 3, and returns the result.

), more specifically<br/>
[Function0](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Function0), [Function1](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Function1),<br/>
[Function2](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Function2), [Function3](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Function3),<br/>
[Function4](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Function4), or [Function5](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Function5).<br/>
They cannot have more than five parameters.

To invoke an anonymous function, call its [apply](<https://pkl-lang.org/package-docs/pkl/0.28.1/base/Function1#apply()>) method:

```pkl expression hljs
((n) -> n * 3).apply(4) // 12
```

pkl expression![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Many standard library methods accept anonymous functions:

s://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Anonymous functions can be assigned to properties, thereby giving them a name:

```pkl hljs
add = (a, b) -> a + b
added = add.apply(2, 3)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!
omary to declare a method instead:<br>`pkl hljs<br>function add(a, b) = a + b<br>added = add(2, 3)<br>`<br> |

An anonymous function's parameters can have type annotations:

```pkl expression hljs
(a: Number, b: Number) -> a + b
```

pkl expression![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

ures\_: They can access members defined in a lexically enclosing scope, even after leaving that scope:

```pkl hljs
a = 42
addToA = (b: Number) -> a + b
list = List(1, 2, 3).map(addToA) // List(43, 44, 45)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

function argument to the left and an anonymous function to the right.<br/>
The pipe operator works especially well for chaining multiple functions:

```pkl hljs
mul3 = (n) -> n * 3
add2 = (n) -> n + 2

num = 4
  |> mul3
  |> add2
  |> mul3 (1)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |              |
| ----- | ------------ |
| **1** | result: `42` |

Like methods, anonymous functions can be recursive:

```pkl hljs
factor = (n: Number(isPositive)) -> if (n < 2) n else n * factor.apply(n - 1)
num = factor.apply(5) (1)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |               |
| ----- | ------------- |
| **1** | result: `120` |

ous function used to apply the same modification to different objects.

Even though mixins are regular functions, they are best created with object syntax:

```pkl hljs
withDiet = new Mixin {
  diet = "Seeds"
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Mixins can optionally specify which type of object they apply to:

````pkl hljs
class Bird { diet: String }

language-reference/img/octicons-16.svg#view-clippy)Copied!

For properties with type annotation, the shorthand `new { …​ }` syntax can be used:

```pkl hljs
withDietTyped: Mixin<Bird> = new {
  diet = "Seeds"
}
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

To apply a mixin, use the `|>` (pipe) operator:

```pkl hljs
pigeon {
  name = "Pigeon"
}
pigeonWithDiet = pigeon |> withDiet

barnOwl {
  name = "Barn owl"
}
barnOwlWithDiet = barnOwl |> withDiet
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

`withDiet` can be generalized by turning it into a factory method for mixins:

```pkl hljs
function withDiet(_diet: String) = new Mixin {
  diet = _diet
}
seedPigeon = pigeon |> withDiet("Seeds")
MiceBarnOwl = barnOwl |> withDiet("Mice")
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

Mixins can themselves be modified with [function amending](https://pkl-lang.org/main/current/language-reference/index.html#function-amending).
)

An anonymous function that returns an object can be amended with the same syntax as that object.<br/>
The result is a new function that accepts the same number of parameters as the original function,<br/>
applies the original function to them, and amends the returned object.

Function amending is a special form of function composition.<br/>
Thanks to function amending, [Listing.default](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Listing#default)<br/>
and [Mapping.default](https://pkl-lang.org/package-docs/pkl/0.28.1/base/Mapping#default) can be treated as if they were objects,<br/>
only gradually revealing their true (single-parameter function) nature:

```pkl hljs
birds = new Mapping {
  default { (1)
    diet = "Seeds"
  }
  ["Pigeon"] { (2)
    lifespan = 8
ppy)Copied!

|     |     |
| --- | --- |
| **1** | Amends the `default` function, which returns a default mapping value given a mapping key, and sets property `diet`. |
| **2** | Implicitly applies the amended `default` function and amends the returned object with property `lifespan`. |

The result is a mapping whose entry `"Pigeon"` has both `diet` and `lifespan` set.

When amending an anonymous function, it is possible to access its parameters<br/>
by declaring a comma-separated, arrow (`→`) terminated parameter list after the opening curly brace (`{`).
s
birds = new Mapping {
  default { key -> (1)
    name = key
  }
  ["Pigeon"] {} (2)
  ["Barn owl"] {} (3)
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                                                                                                                                                                                                                                                       |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1** | Amends the `default` function and sets the `name` property to the mapping entry's key.<br>To access the `default` function's key parameter, it is declared with `key →`.<br>(Any other parameter name could be chosen, but `key` is customary for default functions.) |
| **2** | Defines a mapping entry with key `"Pigeon"`                                                                                                                                                                                                                           |

"`and`"Barn owl"`whose`name` properties are set to their keys.

Function amending can also be used to refine [mixins](https://pkl-lang.org/main/current/language-reference/index.html#mixins).

### [Amending Null Values](https://pkl-lang.org/main/current/language-reference/index.html#amend-null)

It's time to lift a secret: The predefined `null` value is just one of the potentially many values of type `Null`.

First, here are the technical facts:

- Null values are constructed with `pkl.base#Null()`.
- `Null(x)` constructs a null value that is equivalent to `x` when amended.<br/>
  In other words, `Null(x) { …​ }` is equivalent to `x { …​ }`.

But what is it useful for?

Null values with default are used to define properties that are null ("switched off") by default but have a default value once amended ("switched on").

Here is an example:

template.pkl

```pkl hljs
// we don't have a pet yet, but already know that it is going to be a bird
pet = Null(new Dynamic {
  animal = "bird"
})
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

}

````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

A null value can be switched on without adding or overriding a property:

```pkl hljs
amends "template.pkl"

// We do not need to name anything if we have no pet yet
pet {}
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

uivalent to amending `Dynamic {}` (the empty dynamic object):

```pkl hljs
pet = null
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

```pkl hljs
pet {
  name = "Parry the Parrot"
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

In most cases, the `Null()` method is not used directly.<br/>
Instead, it is used under the hood to create implicit defaults for properties with nullable type:

template.pkl

```pkl hljs
class Pet {
  name: String
  animal: String = "bird"
}

// defaults to `Null(Pet {})`
pet: Pet?
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

```pkl hljs
amends "template.pkl"

pet {
  name = "Perry the Parrot"
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!
`x`, and to `null` if `X` has no default value.

### [When Generators](https://pkl-lang.org/main/current/language-reference/index.html#when-generators)

`when` generators conditionally generate object members.<br/>
They come in two variants:

1. `when (<condition>) { <members> }`
2. `when (<condition>) { <members> } else { <members> }`

The following code conditionally generates properties `hobby` and `idol`:

````pkl hljs
isSinger = true

parrot {
  lifespan = 20
  when (isSinger) {
    hobby = "singing"
    idol = "Frank Sinatra"
  }
}
pied!

`when` generators can have an `else` part:

```pkl hljs
isSinger = false

parrot {
  lifespan = 20
  when (isSinger) {
    hobby = "singing"
    idol = "Aretha Franklin"
  } else {
    hobby = "whistling"
    idol = "Wolfgang Amadeus Mozart"
  }
}
pied!

Besides properties, `when` generators can generate elements and entries:

```pkl hljs
abilities {
  "chirping"
  when (isSinger) {
"Parrot"] = "singing" (2)
  }
  ["Parrot"] = "whistling"
}
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                     |
| ----- | ------------------- |
| **1** | conditional element |

ex.html\#for-generators)

`for` generators generate object members in a loop.<br/>
They come in two variants:

1. `for (<value> in <iterable>) { <members> }`
2. `for (<key>, <value> in <iterable>) { <members> }`

The following code generates a `birds` object containing three elements.<br/>
Each element is an object with properties `name` and `lifespan`.

```pkl hljs
      lifespan = 42
    }
  }
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

The following code generates a `birdsByName` object containing three entries.<br/>
= Map("Pigeon", 8, "Barn owl", 15, "Parrot", 20)

birdsByName {
for (\_name, \_lifespan in namesAndLifespans) {
[_name] {
name = \_name
lifespan = \_lifespan
}
}
Copied!

The following types are iterable:

| Type                  | Key                                                            | Value                                          |
| --------------------- | -------------------------------------------------------------- | ---------------------------------------------- |
| `IntSeq`              | element index (`Int`)                                          | element value (`Int`)                          |
| `List<Element>`       | element index (`Int`)                                          | element value (`Element`)                      |
| `Set<Element>`        | element index (`Int`)                                          | element value (`Element`)                      |
| `Map<Key, Value>`     | entry key (`Key`)                                              | entry value (`Value`)                          |
| `Listing<Element>`    | element index (`Int`)                                          | element value (`Element`)                      |
| `Mapping<Key, Value>` | entry key (`Key`)                                              | entry value (`Value`)                          |
| `Dynamic`             | element index (`Int`)<br>entry key<br>property name (`String`) | element value<br>entry value<br>property value |

Indices are zero-based.<br/>
Note that `for` generators can generate elements and entries but not properties.\[[7](https://pkl-lang.org/main/current/language-reference/index.html#_footnotedef_7 "View footnote.")\]

### [Spread Syntax ( `...`)](https://pkl-lang.org/main/current/language-reference/index.html#spread-syntax)

on-nullable variant and a nullable variant.

1. `…<iterable>`
2. `…?<iterable>`

Spreading an [`Object`](https://pkl-lang.org/main/current/language-reference/index.html#objects) (one of `Dynamic`, `Listing` and `Mapping`) will unpack all of its members into the enclosing object \[[8](https://pkl-lang.org/main/current/language-reference/index.html#_footnotedef_8 "View footnote.")\].<br/>
Entries become entries, elements become elements, and properties become properties.

````pkl hljs
entries1 {
  ["Pigeon"] = "Piggy the Pigeon"
  ["Barn owl"] = "Barney the Barn owl"
}

entries2 {
  ...entries1 (1)
}

elements1 { 1; 2 }

elements2 {
  ...elements1 (2)
}
n](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | Spreads entries `["Pigeon"] = "Piggy the Pigeon"` and `["Barn owl"] = "Barney the Barn owl"` |
| **2** | Spreads elements `1` and `2` |
| **3** | Spreads properties `name = "Pigeon"` and `diet = "Seeds"` |

Spreading all other iterable types generates members determined by the iterable.<br/>
The following table describes how different iterables turn into object members:

| Iterable type | Member type |
| --- | --- |
| `Map` | Entry |
| `List` | Element |
| `Set` | Element |
| `IntSeq` | Element |

These types can only be spread into enclosing objects that support that member type.<br/>
For example, a `List` can be spread into a `Listing`, but cannot be spread into a `Mapping`.

In some ways, spread syntax can be thought of as a shorthand for a [for generator](https://pkl-lang.org/main/current/language-reference/index.html#for-generators). One key difference is that spread syntax can generate properties, which is not possible with a for generator.

|     |     |
| --- | --- |
|  | Look out for duplicate key conflicts when using spreads.<br/>

Spreading entries or properties may cause conflicts due to matched existing key definitions.

```pkl hljs
oldPets {
  ["Pigeon"] = "Piggy the Pigeon"
  ["Parrot"] = "Perry the Parrot"
}

newPets {
  ...oldPets
  ["Pigeon"] = "Toby the Pigeon" (1)
}
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                                   |
| ----- | ------------------------------------------------- | --- |
| **1** | Error: Duplicate definition of member `"Pigeon"`. |     |

#### [Nullable spread](https://pkl-lang.org/main/current/language-reference/index.html#nullable-spread)

A non-nullable spread (`…`) will error if the value being spread is `null`.

In contrast, a nullable spread (`…?`) is syntactic sugar for wrapping a spread in a [`when`](https://pkl-lang.org/main/current/language-reference/index.html#when-generators).

The following two snippets are logically identical.

```pkl hljs
result {
  ...?myValue
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

````pkl hljs
result {
  when (myValue != null) {
16.svg#view-clippy)Copied!

### [Member Predicates ( `[[…​]]`)](https://pkl-lang.org/main/current/language-reference/index.html\#member-predicates)

Occasionally it is useful to configure all object members matching a predicate.<br/>
This is especially true when configuring elements, which—unlike entries—cannot be accessed by key:

```pkl hljs
environmentVariables {   (1)
  new { name = "PIGEON"; value = "pigeon-value" }
  new { name = "PARROT"; value = "parrot-value" }
  new { name = "BARN OWL"; value = "barn-owl-value" }
}

updated = (environmentVariables) {
  [[name == "PARROT"]] { (2)
    value = "new-value"  (3)
  }
}
````

!

|       |                                                                                      |
| ----- | ------------------------------------------------------------------------------------ |
| **1** | a listing of environment variables                                                   |
| **2** | amend element(s) whose name equals "PARROT"<br>(`name` is shorthand for `this.name`) |
| **3** | update value to "new-value"                                                          |

The predicate, enclosed in double brackets (`\[[…​]]`), is matched against each member of the enclosing object.<br/>
Within the predicate, `this` refers to the member that the predicate is matched against.<br/>
Matching members are amended (`{ …​ }`) or overridden (`= <new-value>`).

### [`this` keyword](https://pkl-lang.org/main/current/language-reference/index.html#this-keyword)

Normally, the `this` keyword references the enclosing object's receiver.

Example:
in/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

When used inside a [type constraint](https://pkl-lang.org/main/current/language-reference/index.html#type-constraints), `this` refers to the value being tested.

Example:

```pkl hljs
port: UInt16(this > 1000)
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

When used inside a [member predicate](https://pkl-lang.org/main/current/language-reference/index.html#member-predicates), `this` refers to the value being matched against.

Example:

```pkl hljs
t/language-reference/img/octicons-16.svg#view-clippy)Copied!

#### [Receiver](https://pkl-lang.org/main/current/language-reference/index.html\#receiver)

The receiver is the bottom-most object in the [Prototype Chain](https://pkl-lang.org/main/current/language-reference/index.html#prototype-chain).<br/>
That means that, within the context of an amending object, the receiver is the amending object.

Example:

)
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                  |
| ----- | -------------------------------- |
| **1** | Polly has title `"Polly, Esq."`. |

### [`outer` keyword](https://pkl-lang.org/main/current/language-reference/index.html#outer-keyword)

The `outer` keyword references the [receiver](https://pkl-lang.org/main/current/language-reference/index.html#receiver) of the immediately outer lexical object.

It can be useful to disambiguate a lookup that might otherwise resolve elsewhere.

Example:

````pkl hljs
foo {
  bar = "bar"
nce/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
| **1** | References `bar` one level higher. |

Note that `outer` cannot be chained.<br/>
In order to reference a value more than one level higher, a typical pattern is to declare a local property at that level.

For example:

```pkl hljs
foo {
  local self = this
  bar {
    baz {
      qux = self.qux
    }
  }
}
````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

### [`super` keyword](https://pkl-lang.org/main/current/language-reference/index.html#super-keyword)

The `super` keyword references the parent object in the [prototype chain](https://pkl-lang.org/main/current/language-reference/index.html#prototype-chain).

When used within a class, it refers to the superclass's prototype.<br/>
When used within an object, it refers to the parent object in the amends chain.

Example:

```pkl hljs
bird = new { name = "Quail" }

bird2 = (bird) { name = "Ms. \(super.name)" } (1)

abstract class Bird {
  foods: Listing<String>

  function canEat(food: String): Boolean = foods.contains(food)
}

class InsectavorousBird extends Bird {
  function canEat(food: String) =
    super.canEat(food) || food == "insect" (2)
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

|       |                                      |
| ----- | ------------------------------------ |
| **1** | Result: `"Ms. Quail"`                |
| **2** | Calls parent class method `canEat()` |

The `super` keyword must be followed by property/method access, or subscript.<br/>
`super` by itself a syntax error; whereas `super.foo` and `super["foo"]` are valid expressions.

### [`module` keyword](https://pkl-lang.org/main/current/language-reference/index.html#module-keyword)

The `module` keyword can be used as either a value, or as a type.

.html#receiver) of the module itself.

```pkl hljs
name = "Quail"

some {
  deep {
    object {
      name = module.name (1)
    }
  }
}
```

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

| ``pkl hljs
module Bird

friend: module (1)

````

pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!

ule is extended by another module, the `module` type refers to the extending module when<br/>
in the context of that module.

### [Glob Patterns](https://pkl-lang.org/main/current/language-reference/index.html\#glob-patterns)

Resources and modules may be imported at the same time by globbing with the [Globbed Imports](https://pkl-lang.org/main/current/language-reference/index.html#globbed-imports) and [Globbed Reads](https://pkl-lang.org/main/current/language-reference/index.html#globbed-reads) features.

Pkl's glob patterns mostly follow the rules described by [glob(7)](https://man7.org/linux/man-pages/man7/glob.7.html), with the following differences:

- `*` includes names that start with a dot (`.`).
- `**` behaves like `*`, except it also matches directory boundary characters (`/`).
- Named character classes are not supported.
- Collating symbols are not supported.
- Equivalence class expressions are not supported.
- Support for [sub-patterns](https://pkl-lang.org/main/current/language-reference/index.html#glob-sub-patterns) (patterns within `{` and `}`) are added.

-reference/index.html\#wildcards)

The following tokens denote wildcards:

| Wildcard | Meaning |
| --- | --- |
| `*` | Match zero or more characters, until a directory boundary (`/`) is reached. |
| `**` | Match zero or more characters, crossing directory boundaries. |
| `?` | Match a single character. |
| `[…​]` | Match a single character represented by this [character class](https://pkl-lang.org/main/current/language-reference/index.html#character-classes). |

|     |     |
| --- | --- |
cter Classes](https://pkl-lang.org/main/current/language-reference/index.html\#character-classes)

Character classes are sequences delimited by the `[` and `]` characters, and represent a single<br/>
character as described by the sequence within the enclosed brackets.<br/>
For example, the pattern `[abc]` means "a single character that is a, b, or c".

Character classes may be negated using `!`.<br/>
For example, the pattern `[!abc]` means "a single character that is not a, b, nor c".

Character classes may use the `-` character to denote a range.<br/>
The pattern `[a-f]` is equivalent to `[abcdef]`.<br/>
If the `-` character exists at the beginning or the end of a character class, it does not carry any special meaning.

Within a character class, the characters `{`, `}`, `\`, `*`, and `?` do not have any special meaning.

A character class is not allowed to be empty.<br/>
Thus, if the first character within the character class is `]`, it is treated literally and not as the closing delimiter of the character class.<br/>
For example, the glob pattern `[]abc]` matches a single character that is either `]`, `a`, `b`, or `c`.
b-patterns are glob patterns delimited by the `{` and `}` characters, and separated by the `,` character.<br/>
For example, the pattern `{pigeon,parrot}` will match either `pigeon` or `parrot`.

Sub-patterns cannot be nested. The pattern `{foo,{bar,baz}}` is not a valid glob pattern, and an error will be thrown during evaluation.

#### [Escapes](https://pkl-lang.org/main/current/language-reference/index.html\#escapes)

The escape character (`\`) can be used to remove the special meaning of a character. The following escapes are valid:

- `\[`<br/>
\
- `\*`<br/>
 error is thrown.<br/>
<br/>
| |     |<br/>
| --- | --- |<br/>
| | If incorporating escape characters into a glob pattern, use [custom string delimiters](https://pkl-lang.org/main/current/language-reference/index.html#custom-string-delimiters) to express the glob pattern. For example, `import*(#"\{foo.pkl"#)`. This way, the backslash is interpreted as a backslash and not a string escape. |<br/>
\

#### [Examples](https://pkl-lang.org/main/current/language-reference/index.html\#examples)\

<br/>
r/>
| `**.y{a,}ml` | Anything suffixed by either `yml` or `yaml`, crossing directory boundaries. |<br/>
| `birds/{*.yml,*.json}` | Anything within the `birds` subdirectory that ends in `.yml` or `.json`. This pattern is equivalent to `birds/*.{yml,json}`. |<br/>
| `a?*.txt` | Anything starting with `a` and at least one more letter, and suffixed with `.txt`. |<br/>
| `modulepath:/**.pkl` | All Pkl files in the module path. |<br/>
\

### [Quoted Identifiers](https://pkl-lang.org/main/current/language-reference/index.html\#quoted-identifiers)\

<br/>
An identifier is the name part of an entity in Pkl.<br/>
Entities that are named by identifiers include classes, properties, typealiases, and modules.<br/>
For example, `class Bird` has the identifier `Bird`.<br/>
<br/>
Normally, an identifier must conform to Unicode's [UAX31-R1-1 syntax](https://unicode.org/reports/tr31/#R1-1), with the additions of `_` and `$` permitted as identifier start characters.<br/>
Additionally, an identifier cannot clash with a keyword.<br/>
uoted identifier_.<br/>
\
```pkl hljs\
`A Bird's First Flight Time` = 5.s\
```\
\
pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!\
\
|     |     |\
| --- | --- |\
|  | Backticks are not part of a quoted identifier’s name, and surrounding an already legal identifier with backticks is redundant.\
\
ang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!\
\
|     |     |\
| --- | --- |\
| **1** | Equivalent to `number = 42` |\
| **2** | References property `` `number` `` |\
| **3** | Also references property `` `number` `` | |\
\

### [Doc Comments](https://pkl-lang.org/main/current/language-reference/index.html\#doc-comments)\

\
Doc comments are the user-facing documentation of a module and its members.\
They consist of one or more lines starting with a triple slash (`///`).\
Here is a doc comment for a module:\
\
```pkl hljs\
/// An aviated animal going by the name of [bird](https://en.wikipedia.org/wiki/Bird).\
///\
/// These animals live on the planet Earth.\
module com.animals.Birds\
```\
\
pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!\
\
Doc comments are written in Markdown.\
[GitHub flavored Markdown tables](https://help.github.com/articles/organizing-information-with-tables)\
\
\
|     |     |\
| --- | --- |\
|  | Plaintext URLs are only rendered as links when enclosed in angle brackets:<br>```pkl hljs<br>/// A link is *not* generated for https://example.com.<br>/// A link *is* generated for <https://example.com>.<br>```<br>pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied! |\
\
Doc comments are consumed by humans reading source code, the _Pkldoc_ documentation generator, code generators, and editor/IDE plugins.\
They are programmatically accessible via the [pkl.reflect](https://pkl-lang.org/package-docs/pkl/0.28.1/reflect/) Pkl API and [ModuleSchema](https://github.com/apple/pkl/tree/0.28.1/pkl-core/src/main/java/org/pkl/core/ModuleSchema.java) Java API.\
\
|     |     |\
| --- | --- |\
|  | Doc Comment Style Guidelines<br>- Use proper spelling and grammar.<br>  <br>- Start each sentence on a new line and capitalize the first letter.<br>  <br>- End each sentence with a punctuation mark.<br>  <br>- The first paragraph of a doc comment is its _summary_.<br>Keep the summary short (a single sentence is common)<br>and insert an empty line ( `///`) before the next paragraph. |\
\
Doc comments can be attached to module, class, type alias, property, and method declarations.\
Here is a comprehensive example:\
\
Birds.pkl\
\
```pkl hljs\
/// An aviated animal going by the name of [bird](https://en.wikipedia.org/wiki/Bird).\
///\
/// These animals live on the planet Earth.\
module com.animals.Birds\

class Bird {\
  /// The name of this bird.\
  name: String\
\
  /// The lifespan of this bird.\
  lifespan: UInt8\
\
  /// Tells if this bird is older than [bird].\
  function isOlderThan(bird: Bird): Boolean = lifespan > bird.lifespan\
}\
\
/// An adult [Bird].\
typealias Adult = Bird(lifespan >= 2)\
\
/// A common [Bird] found in large cities.\
pigeon: Bird = new {\
  name = "Pigeon"\
  lifespan = 8\
}\
\
/// Creates a [Bird] with the given [_name] and lifespan `0`.\
function Infant(_name: String): Bird = new { name = _name; lifespan = 0 }\
```\
\
pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!\
\

#### [Member Links](https://pkl-lang.org/main/current/language-reference/index.html\#member-links)\

\
To link to a member declaration, write the member’s name enclosed in square brackets ( `[]`):\
\
```pkl hljs\
/// A common [Bird] found in large cities.\
```\
\
pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!\
\
To customize the link text, insert the desired text, enclosed in square brackets, before the member name:\
/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!\
\
Custom link text can use markup:\
\
```pkl hljs\
/// A [*common* Bird][Bird] found in large cities.\
```\
\
pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!\
\
The short link `[Bird]` is equivalent to ``[`Bird`][Bird]``.\
members of _Birds.pkl_ (see above) is as follows:\
\
Module\
\
- `[module]` (from same module)\
\
- `[Birds]` (from a module that contains `import "Birds.pkl"`)\
\
\
Class\
\
pe Alias\
\
- `[Adult]` (from same module)\
\
- `[Birds.Adult]` (from a module that contains `import "Birds.pkl"`)\
\
\
Class Property\
\
hat contains `import "Birds.pkl"`)\
\
\
Class Method\
\
- `[greet()]` (from same class)\
\
- `[Bird.greet()]` (from same module)\

- `[bird]` (from same method)\
\
\
Module Property\
\
- `[pigeon]` (from same module)\
\
- `[Birds.pigeon]` (from a module that contains `import "Birds.pkl"`)\
\
\
Module Method\
\
- `[isPigeon()]` (from same module)\
\
- `[Birds.isPigeon()]` (from a module that contains `import "Birds.pkl"`)\
\
eir simple name:\
\
```pkl hljs\
/// Returns a [String].\
```\
\
pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!\
\
Module-level members can be prefixed with `module.` to resolve name conflicts:\
\
erence/img/octicons-16.svg#view-clippy)Copied!\
\
To exclude a member from documentation and code completion, annotate it with `@Unlisted`:\
\
```pkl hljs\
@Unlisted\
pigeon: Bird\
```\
\
pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!\
\
The following member links are marked up as code but not rendered as links:\[ [9](https://pkl-lang.org/main/current/language-reference/index.html#_footnotedef_9 "View footnote.")\]\
\
- `[null]`, `[true]`, `[false]`, `[this]`, `[unknown]`, `[nothing]`\
\
- self-links\
\
- subsequent links to the same member from the same doc comment\
\
- links to a method’s own parameters\
\
\
Nevertheless, it is a good practice to use member links in the above cases.\
\

### [Name Resolution](https://pkl-lang.org/main/current/language-reference/index.html\#name-resolution)\
py icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!\
\
The call site’s "variable" syntax reveals that `x` refers to a _LAMP_\
(let binding, anonymous function parameter, method parameter, or property) definition. But which one?\
\
To answer this question, Pkl follows these steps:\
\
1. Search the lexically enclosing scopes of `x`,\
starting with the scope in which `x` occurs and continuing outwards\
up to and including the enclosing module’s top-level scope, for a LAMP definition named `x`.\
If a match is found, this is the answer.\
\
2. Search the `pkl.base` module for a top-level definition of property `x`.\
If a match is found, this is the answer.\
\
3. Search the [prototype chain](https://pkl-lang.org/main/current/language-reference/index.html#prototype-chain) of `this`, from bottom to top, for a definition of property `x`.\
If a match is found, this is the answer.\
\
4. Throw a "name `x` not found" error.\
language.org/).<br>The goal is for name resolution to be stable with regard to changes in external modules.<br>This is why lexically enclosing scopes are searched before the prototype chain of `this`,<br>and why the prototype chains of lexically enclosing scopes are not searched,<br>which sometimes requires the use of `outer.` or `module.`.<br>For name resolution to fully stabilize, the list of top-level properties defined in `pkl.base` needs to be freezed.<br>This is tentatively planned for Pkl 1.0. |\
\
Consider this snippet of code buried deep inside a config file:\
\
```pkl hljs\
a = x("foo") + 1\
```\
\
pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!\
\
The call site’s method call syntax reveals that `x` refers to a method definition. But which one?\
\
To answer this question, Pkl follows these steps:\
\
1. Search the call sites' lexically enclosing scopes,\
starting with the scope in which the call site occurs and continuing outwards\
up to and including the enclosing module’s top-level scope, for a definition of method `x`.\
If a match is found, this is the answer.\
\
2. Search the `pkl.base` module for a top-level definition of method `x`.\
If a match is found, this is the answer.\
\
ntil and including class `Any`, for a method named `x.`\
If a match is found, this is the answer.\
\
4. Throw a "method `x` not found" error.\
\
\
|     |     |\
| --- | --- |\
|  | Pkl does not support arity or type-based method overloading.<br>Hence, the argument list of a method call is irrelevant for method resolution. |\
\

#### [Prototype Chain](https://pkl-lang.org/main/current/language-reference/index.html\#prototype-chain)\

\
Pkl’s object model is based on [prototypical inheritance](https://en.wikipedia.org/wiki/Prototype-based_programming).\
The prototype chain of object\[ [10](https://pkl-lang.org/main/current/language-reference/index.html#_footnotedef_10 "View footnote.")\] `x` contains, from bottom to top:\
\
1. The chain of objects amended to create `x`, ending in `x` itself, in reverse order.\[ [11](https://pkl-lang.org/main/current/language-reference/index.html#_footnotedef_11 "View footnote.")\]\
\
2. The prototype of the class of the top object in (1).\
If no amending took place, this is the class of `x`.\
\
3. The prototypes of the superclasses of (2).\
\
\
The prototype of class `X` is an instance of `X` that defines the defaults for properties defined in `X`.\
Its direct ancestor in the prototype chain is the prototype of the superclass of `X`.\
\
The prototype of class `Any` sits at the top of every prototype chain.\
To reduce the chance of naming collisions, `Any` does not define any property names.\[ [12](https://pkl-lang.org/main/current/language-reference/index.html#_footnotedef_12 "View footnote.")\]\
\
 8 }\
```\
\
pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!\
\
The prototype chain of object `two` contains, now listed from top to bottom:\
\
1. The prototype of class `Any`.\
\
2. The prototype of class `Dynamic`.\
\
3. `one`\
\
4. `two`\
\
\
Consider the following code:\
\

one = new Bird { name = "Pigeon" }\
two = (one) { lifespan = 8 }\
```\
\
pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!\
\
The prototype chain of object `two` contains, listed from top to bottom:\
\
1. The prototype of class `Any`.\
\
2. The prototype of class `Typed`.\
\
3. The prototype of class `Named`.\
\
4. The prototype of class `Bird`.\
\
5. `one`\
\
6. `two`\
\
\

##### [Non-object Values](https://pkl-lang.org/main/current/language-reference/index.html\#non-object-values)\

\
The prototype chain of non-object value `x` contains, from bottom to top:\
\
1. The prototype of the class of `x`.\
\
2. The prototypes of the superclasses of (1).\
\
\
For example, the prototype chain of value `42` contains, now listed from top to bottom:\
\
1. The prototype of class `Any`.\
\
2. The prototype of class `Number`.\
\
3. The prototype of class `Int`.\
\
\
A prototype chain never contains a non-object value, such as `42`.\
\

### [Reserved keywords](https://pkl-lang.org/main/current/language-reference/index.html\#reserved-keywords)\

\
The following keywords are reserved in the language.\
They cannot be used as a regular identifier, and currently do not have any meaning.\
\
- `protected`\
\
- `override`\
\
surround them with backticks](https://pkl-lang.org/main/current/language-reference/index.html#quoted-identifiers).\
\
For a complete list of keywords, consult field `Lexer.KEYWORDS` in [Lexer.java](https://github.com/apple/pkl/tree/0.28.1/pkl-core/src/main/java/org/pkl/core/parser/Lexer.java).\
\

### [Blank Identifiers](https://pkl-lang.org/main/current/language-reference/index.html\#blank-identifiers)\

\
Blank identifiers can be used in many places to ignore parameters and variables.\
\
`_` is not a valid identifier. To use it as a parameter or variable name,\
it needs to be enclosed in backticks: \`\_\`.\
\

#### [Functions and methods](https://pkl-lang.org/main/current/language-reference/index.html\#functions-and-methods)\

\
```pkl hljs\
birds = List("Robin", "Swallow", "Eagle", "Falcon")\
indexes = birds.mapIndexed((i, _) -> i)\
\
function constantly(_, second) = second\
```\
\
pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!\
\

#### [For generators](https://pkl-lang.org/main/current/language-reference/index.html\#for-generators-2)\

\
```pkl hljs\
birdColors = Map("Robin", "blue", "Eagle", "white", "Falcon", "red")\
\
birds = new Listing {\
  for (name, _ in birdColors) {\
    name\
  }\
}\
```\
\
pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!\
\

l hljs\
name = let (_ = trace("defining name")) "Eagle"\
```\
\
pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!\
\

#### [Object bodies](https://pkl-lang.org/main/current/language-reference/index.html\#object-bodies)\

\
```pkl hljs\
birds = new Dynamic {\
  default { _ ->\
    species = "Bird"\
  }\
  ["Falcon"] {}\
  ["Eagle"] {}\
}\
```\
\
\
\

### [Projects](https://pkl-lang.org/main/current/language-reference/index.html\#projects)\

\
A _project_ is a directory of Pkl modules and other resources.\
It is defined by the presence of a `PklProject` file that amends the standard library module\
`pkl:Project`.\
\
 modules within a logical project.\
\
2. It helps with managing [package](https://pkl-lang.org/main/current/language-reference/index.html#package-asset-uri) dependencies for Pkl modules within a logical project.\
\
3. It enables packaging and sharing the contents of the project as a [package](https://pkl-lang.org/main/current/language-reference/index.html#package-asset-uri).\
\
4. It allows importing packages via dependency notation.\
\
\

#### [Dependencies](https://pkl-lang.org/main/current/language-reference/index.html\#project-dependencies)\

\
A project is useful for managing [package](https://pkl-lang.org/main/current/language-reference/index.html#package-asset-uri) dependencies.\
\
Within a PklProject file, dependencies can be defined:\
\
PklProject\
\
```pkl hljs\
amends "pkl:Project"\
 icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!\
\
|     |     |\
| --- | --- |\
| **1** | Declare dependency on `package://example.com/birds@1.0.0` with simple name "birds". |\
\
These dependencies can then be imported by their simple name.\
This syntax is called _dependency notation_.\
\
Example:\
\
```pkl hljs\
import "@birds/Bird.pkl" (1)\
\
pigeon: Bird = new {\
  name = "Pigeon"\
}\
```\
\
pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!\
\
|     |     |\
| --- | --- |\
| **1** | Dependency notation; imports path `/Bird.pkl` within dependency `package://example.com/birds@1.0.0` |\
cies imported using dependency notation. |\
\
When the project gets published as a _package_, these names and URIs are preserved as the package’s dependencies.\
\

#### [Resolving Dependencies](https://pkl-lang.org/main/current/language-reference/index.html\#resolving-dependencies)\

\
Dependencies that are declared in a `PklProject` file must be _resolved_ via CLI command [`pkl project resolve`](https://pkl-lang.org/main/current/pkl-cli/index.html#command-project-resolve).\
This builds a single dependency list, resolving all transitive dependencies, and determines the appropriate version for each package.\
resolved dependencies.\
\
When resolving version conflicts, the CLI will pick the latest [semver](https://semver.org/) minor version of each package.\
For example, if the project declares a dependency on package A at `1.2.0`, and a package transitively declares a dependency on package A at `1.3.0`, version `1.3.0` is selected.\
\
In short, the algorithm has the following steps:\
\
1. Gather a list of all dependencies, either directly declared or transitive.\
\
2. For each dependency, keep only the newest minor version.\
\
\
The resolve command is idempotent; given a PklProject file, it always produces the same set of resolved dependencies.\
\
esearch.swtch.com/vgo-mvs#algorithm_1). |\
\

#### [Creating a Package](https://pkl-lang.org/main/current/language-reference/index.html\#creating-a-package)\

\
Projects enable the creation of a [package](https://pkl-lang.org/main/current/language-reference/index.html#package-asset-uri).\
To create a package, the `package` section of a `PklProject` module must be defined.\
\
PklProject\
\
```pkl hljs\
amends "pkl:Project"\
\
package {\
  name = "mypackage" (1)\
  baseUri = "package://example.com/\(name)" (2)\
  version = "1.0.0" (3)\
  packageZipUrl = "https://example.com/\(name)/\(name)@\(version).zip" (4)\
py)Copied!\
\
|     |     |\
| --- | --- |\
| **1** | The display name of the package.For display purposes only. |\
| **2** | The package URI, without the version part. |\
| **3** | The version of the package. |\
| **4** | The URL to download the package’s ZIP file. |\
\
The package itself is created by the command [`pkl project package`](https://pkl-lang.org/main/current/pkl-cli/index.html#command-project-package).\
\
This command only prepares artifacts to be published.\
Once the artifacts are prepared, they are expected to be uploaded to an HTTPS server such that the ZIP asset can be downloaded at path `packageZipUrl`, and the metadata can be downloaded at `https://<package uri>`.\
\

#### [Local dependencies](https://pkl-lang.org/main/current/language-reference/index.html\#local-dependencies)\

\
A project can depend on a local project as a dependency.\
This can be useful for:\
\
- Structuring a monorepo that publishes multiple packages.\
\
cy, import its `PklProject` file.\
The imported `PklProject` _must_ have a package section defined.\
\
birds/PklProject\
\
```pkl hljs\
amends "pkl:Project"\
\
dependencies {\
  ["fruit"] = import("../fruit/PklProject") (1)\
}\
\
package {\
  name = "birds"\
  baseUri = "package://example.com/birds"\
  version = "1.8.3"\
  packageZipUrl = "https://example.com/birds@\(version).zip"\
}\
```\
\
pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!\
\
roject\
\
```pkl hljs\
amends "pkl:Project"\
\
package {\
  name = "fruit"\
  baseUri = "package://example.com/fruit"\
  version = "1.5.0"\
  packageZipUrl = "https://example.com/fruit@\(version).zip"\
}\
```\
\
pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!\
\
From the perspective of project `birds`, `fruit` is just another package.\
It can be imported using dependency notation, i.e. `import "@fruit/Pear.pkl"`.\
At runtime, it will resolve to relative path `../fruit/Pear.pkl`.\
\
When packaging projects with local dependencies, both the project and its dependent project must be passed to the [`pkl project package`](https://pkl-lang.org/main/current/pkl-cli/index.html#command-project-package) command.\
\

### [External Readers](https://pkl-lang.org/main/current/language-reference/index.html\#external-readers)\

\
External readers are a mechanism to extend the [module](https://pkl-lang.org/main/current/language-reference/index.html#modules) and [resource](https://pkl-lang.org/main/current/language-reference/index.html#resources) URI schemes that Pkl supports.\
Readers are implemented as ordinary executables and use Pkl’s [message passing API](https://pkl-lang.org/main/current/bindings-specification/message-passing-api.html) to communicate with the hosting Pkl evaluator.\
The [Swift](https://pkl-lang.org/swift/current/index.html) and [Go](https://pkl-lang.org/go/current/index.html) language binding libraries provide an `ExternalReaderRuntime` type to facilitate implementing external readers.\
r URI scheme to the executable to run and additional arguments to pass.\
This is done on the command line by passing `--external-resource-reader` and `--external-module-reader` flags, which may both be passed multiple times.\
\
```text hljs\
$ pkl eval <module> --external-resource-reader <scheme>=<executable> --external-module-reader <scheme>='<executable> <argument> <argument>'\
```\
\
text![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!\
\
External readers may also be configured in a [Project’s](https://pkl-lang.org/main/current/language-reference/index.html#projects) `PklProject` file.\
\
```pkl hljs\
evaluatorSettings {\
  externalResourceReaders {\
    ["<scheme>"] {\
      executable = "<executable>"\
    }\
  }\
  externalModuleReaders {\
    ["<scheme>"] {\
      executable = "<executable>"\
      arguments { "<arg>"; "<arg>" }\
    }\
  }\
}\
```\
\
pkl![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!\
resources.\
As with Pkl’s built-in module and resource schemes, setting explicit allowed modules or resources overrides this behavior and appropriate patterns must be specified to allow use of external readers.\
\

#### [Example](https://pkl-lang.org/main/current/language-reference/index.html\#example)\

\
Consider this module:\
\
```pkl hljs\
username = "pigeon"\
\
email = read("ldap://ds.example.com:389/dc=example,dc=com?mail?sub?(uid=\(username))").text\
```\
d!\
\
Pkl doesn’t implement the `ldap:` resource URI scheme natively, but an external reader can provide it.\
Assuming a hypothetical `pkl-ldap` executable implementing the external reader protocol and the `ldap:` scheme is in the `$PATH`, this module can be evaluated as:\
\
```text hljs\
$ pkl eval <module> --external-resource-reader ldap=pkl-ldap\
username = "pigeon"\
email = "pigeon@example.com"\
```\
\
text![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!\
\
In this example, the external reader may provide both `ldap:` and `ldaps:` schemes.\
To support both schemes during evaluation, both would need to be registered explicitly:\
\
```text hljs\
$ pkl eval <module> --external-resource-reader ldap=pkl-ldap --external-resource-reader ldaps=pkl-ldap\
```\
\
text![copy icon](https://pkl-lang.org/main/current/language-reference/img/octicons-16.svg#view-clippy)Copied!\
\
* * *\
\
[1](https://pkl-lang.org/main/current/language-reference/index.html#_footnoteref_1). Pkl’s string literals have fewer character escape sequences, have stricter rules for line indentation in multiline strings, and do not have a line continuation character.\
\
[2](https://pkl-lang.org/main/current/language-reference/index.html#_footnoteref_2). By "structure" we mean a list of property names and (optionally) property types.\
\
[3](https://pkl-lang.org/main/current/language-reference/index.html#_footnoteref_3). By "Use typed objects" we mean to define classes and build data models out of instances of these classes.\
\
[4](https://pkl-lang.org/main/current/language-reference/index.html#_footnoteref_4). Not counting that every module is a typed object.\
\
[5](https://pkl-lang.org/main/current/language-reference/index.html#_footnoteref_5). Strictly speaking, `List`, `Set`, and `Map` are currently soft keywords. The goal is to eventually turn them into regular standard library methods.\
\
[6](https://pkl-lang.org/main/current/language-reference/index.html#_footnoteref_6). Also known as _dynamic type_. We do not use that term to avoid confusion with `Dynamic`, Pkl’s dynamic object type.\
\
[7](https://pkl-lang.org/main/current/language-reference/index.html#_footnoteref_7). More precisely, they cannot generate properties with a non-constant name.\
\
[8](https://pkl-lang.org/main/current/language-reference/index.html#_footnoteref_8). Values that are [`Typed`](https://pkl-lang.org/main/current/language-reference/index.html#typed-objects) are not iterable.\
\
[9](https://pkl-lang.org/main/current/language-reference/index.html#_footnoteref_9). Only applies to links without custom link text.\
\
[10](https://pkl-lang.org/main/current/language-reference/index.html#_footnoteref_10). An instance of `Listing`, `Mapping`, `Dynamic`, or (a subclass of) `Typed`.\
\
[11](https://pkl-lang.org/main/current/language-reference/index.html#_footnoteref_11). All objects in this chain are instances of the same class, except when a direct conversion between listing, mapping, dynamic, and typed object has occurred. For example, `Typed.toDynamic()` returns a dynamic object that amends a typed object.\
\
[12](https://pkl-lang.org/main/current/language-reference/index.html#_footnoteref_12). Method resolution searches the class inheritance rather than prototype chain.
````
