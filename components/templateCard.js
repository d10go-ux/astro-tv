/* ============================================================
   ASTRO TV — Template Card Component
   Card de seleção de template com preview
   ============================================================ */

const TemplateCard = {
  /**
   * Renderiza um grid de cards de template
   * @param {Array} templates - Lista de templates disponíveis
   * @param {string} selectedId - ID do template selecionado
   * @param {Function} onSelect - Callback de seleção
   * @returns {string} HTML do grid
   */
  renderGrid(templates, selectedId, onSelect) {
    TemplateCard._onSelect = onSelect;

    return `
      <div class="template-grid">
        ${templates.map(t => TemplateCard.renderCard(t, selectedId)).join('')}
      </div>
    `;
  },

  /**
   * Renderiza um card individual
   */
  renderCard(template, selectedId) {
    const isSelected = template.id === selectedId;

    return `
      <div class="template-card ${isSelected ? 'selected' : ''}" 
           id="template-${template.id}"
           onclick="TemplateCard.select('${template.id}')">
        <div class="template-card-preview" style="background: ${template.previewBg || 'var(--bg-card)'}">
          ${template.previewHtml || ''}
        </div>
        <div class="template-card-info">
          <h4>${template.name}</h4>
          <p>${template.description || ''}</p>
        </div>
        <div class="template-card-check">✓</div>
      </div>
    `;
  },

  _onSelect: null,

  /**
   * Seleciona um template
   */
  select(id) {
    // Desmarcar todos
    document.querySelectorAll('.template-card').forEach(card => {
      card.classList.remove('selected');
    });

    // Marcar selecionado
    const card = document.getElementById(`template-${id}`);
    if (card) card.classList.add('selected');

    if (TemplateCard._onSelect) {
      TemplateCard._onSelect(id);
    }
  }
};
