# Reference: [Topic Name]

> **Status**: [Draft|Review|Published|Archived]
> **Last Updated**: YYYY-MM-DD
> **Verified**: [✅ Examples tested|⚠️ Needs verification|❌ Unverified]

## Overview

**What this reference covers**: Comprehensive description

**Audience**: Who needs this reference

**Scope**: What's included and excluded

**Related references**: Links to related documentation

---

## Quick Lookup

| Term | Definition | Link |
|------|------------|------|
| Term1 | Brief definition | [Details](#term1) |
| Term2 | Brief definition | [Details](#term2) |
| Term3 | Brief definition | [Details](#term3) |

---

## Core Concepts

### Concept 1: [Name]

**Definition**: Precise definition

**Purpose**: Why this exists and when to use it

**Key characteristics**:
- Characteristic 1
- Characteristic 2
- Characteristic 3

**Example**:
```bash
# Example demonstrating the concept
example-command
```

**Related concepts**: Links to related concepts

---

### Concept 2: [Name]

**Definition**: Precise definition

**Purpose**: Why this exists

**Syntax** (if applicable):
```
syntax-pattern [required] <optional>
```

**Parameters**:
- `parameter1`: Type, constraints, default
- `parameter2`: Type, constraints, default

**Examples**:

#### Example 1: Basic usage
```bash
example-command param1
```

**Output**:
```
Expected output
```

#### Example 2: Advanced usage
```bash
example-command param1 --flag param2
```

**Output**:
```
Expected output
```

**Error cases**:

```bash
# Invalid input
example-command invalid

# Error:
Error message and explanation
```

---

## API Reference (if applicable)

### Function/Method Name

**Signature**:
```typescript
function functionName(param1: Type, param2: Type): ReturnType
```

**Description**: What this function does

**Parameters**:
- `param1` (Type): Description, constraints
- `param2` (Type, optional): Description, default value

**Returns**: Description of return value

**Throws**: Exceptions that may be thrown

**Examples**:

```typescript
// Example 1: Basic usage
const result = functionName('value1', 'value2');
// result = expectedValue
```

```typescript
// Example 2: Edge case
const result = functionName('edge-case', null);
// result = edgeCaseValue
```

**See also**: Related functions

---

## Configuration Reference

### Setting Name

**Type**: `string | number | boolean | object`

**Default**: `default-value`

**Required**: Yes | No

**Description**: What this setting controls

**Valid values**:
- `value1`: What this means
- `value2`: What this means
- `value3`: What this means

**Constraints**:
- Must be valid pattern/range
- Cannot be combined with X
- Requires Y to be set

**Example**:
```json
{
  "settingName": "example-value"
}
```

**Effects**: What changes when this is set

**Interactions**: How this affects other settings

---

## Command Reference

### command-name

**Syntax**:
```bash
command-name [options] <required-arg> [optional-arg]
```

**Description**: What this command does

**Options**:

**`--flag`** or **`-f`**
- **Type**: boolean
- **Default**: false
- **Description**: What this flag does

**`--option=VALUE`** or **`-o VALUE`**
- **Type**: string
- **Default**: "default"
- **Valid values**: val1, val2, val3
- **Description**: What this option controls

**Arguments**:

**`<required-arg>`**
- **Type**: string|number|path
- **Description**: What this argument represents
- **Constraints**: Valid values or format

**`[optional-arg]`**
- **Type**: string|number|path
- **Default**: default-value
- **Description**: What this argument represents

**Exit codes**:
- `0`: Success
- `1`: General error
- `2`: Specific error condition
- `3`: Another error condition

**Examples**:

```bash
# Example 1: Basic usage
command-name required-value
# Output: Success message
# Exit code: 0
```

```bash
# Example 2: With options
command-name --flag --option=value required-value optional-value
# Output: Success message with details
# Exit code: 0
```

```bash
# Example 3: Error case
command-name invalid-value
# Output: Error message
# Exit code: 1
```

**Environment variables**:
- `ENV_VAR_1`: What this affects
- `ENV_VAR_2`: What this affects

**See also**: Related commands

---

## Data Structures

### Structure Name

**Description**: What this structure represents

**Schema**:
```typescript
interface StructureName {
  field1: string;           // Required, description
  field2?: number;          // Optional, description, default
  field3: {                 // Nested structure
    subfield1: boolean;
    subfield2: string[];
  };
}
```

**Field details**:

**`field1`** (string, required)
- **Description**: What this field represents
- **Constraints**: Valid values or format
- **Example**: `"example-value"`

**`field2`** (number, optional)
- **Description**: What this field represents
- **Default**: 0
- **Range**: 0-100
- **Example**: `42`

**Validation rules**:
1. field1 must not be empty
2. field2 must be between 0-100
3. field3.subfield2 must contain at least one item

**Example**:
```json
{
  "field1": "required-value",
  "field2": 42,
  "field3": {
    "subfield1": true,
    "subfield2": ["item1", "item2"]
  }
}
```

---

## Error Reference

### Error Code: ERROR_001

**Message**: "Error message text"

**Cause**: What causes this error

**Resolution**: How to fix this error

**Example**:
```bash
# Command that triggers error
command-with-error

# Output:
ERROR_001: Error message text
```

**Related errors**: Links to similar errors

---

## Compatibility Matrix

| Feature | Version | Platform | Notes |
|---------|---------|----------|-------|
| Feature1 | v1.0+ | All | Fully supported |
| Feature2 | v1.2+ | Linux, macOS | Windows experimental |
| Feature3 | v2.0+ | All | Breaking change from v1.x |

---

## Performance Characteristics

### Operation: [Operation Name]

**Time complexity**: O(n) | O(log n) | O(1)

**Space complexity**: O(n) | O(1)

**Benchmarks**:
- Small input (n=100): ~Xms
- Medium input (n=10,000): ~Xms
- Large input (n=1,000,000): ~Xms

**Optimization tips**: How to improve performance

---

## Glossary

**Term 1**
: Definition with context and examples

**Term 2**
: Definition with context and examples

**Term 3**
: Definition with context and examples

---

## Maintenance Notes

**Last verified**: YYYY-MM-DD by [name]

**Verification steps**:
1. Test all code examples
2. Verify all API signatures current
3. Validate configuration options
4. Check error codes are accurate

**Version documented**: v1.2.3

**Known inaccuracies**: None | [List with plans to fix]

**Planned updates**: Future additions or changes

---

## Metadata

```yaml
doc_type: reference
category: reference
difficulty: intermediate
estimated_time: N/A (reference)
tags: [api, configuration, commands, reference]
dependencies: []
validation_status: verified
last_test_date: YYYY-MM-DD
version_covered: v1.2.3
completeness: 100%
```
