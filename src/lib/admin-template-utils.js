export function getTemplateDefinitions(options) {
  const templates = Array.isArray(options?.templates) ? options.templates : [];
  if (templates.length) return templates;
  return (options?.templateTypes || ['universal']).map((templateType) => ({
    templateType,
    name: templateType,
    description: '',
    assetSlots: (options?.slotTemplates?.[templateType] || []),
    requirements: {},
    fieldGroups: [],
  }));
}

export function findTemplateDefinition(options, templateType) {
  const templates = getTemplateDefinitions(options);
  return templates.find((item) => item.templateType === templateType) || templates[0] || null;
}

export function templateDisplayName(template) {
  return template?.name || template?.templateType || 'Phổ quát';
}

export function templateAssetCount(template) {
  return (template?.assetSlots || []).length;
}

export function templateFieldRows(template) {
  return (template?.fieldGroups || []).flatMap((group) => (
    (group.fields || []).map((field) => ({
      key: field.key,
      label: field.label || field.key,
      required: Boolean(field.required),
      groupLabel: group.label || '',
    }))
  ));
}

export function fieldRequirement(template, key, fallbackRequired = false) {
  for (const group of template?.fieldGroups || []) {
    const field = (group.fields || []).find((item) => item.key === key);
    if (field) return Boolean(field.required);
  }
  return fallbackRequired;
}
