(() => {
  const categories = {
    food: { label: 'Food & dining', icon: '☕', tone: 'gold', color: '#4b94b4' },
    bills: { label: 'Bills & utilities', icon: 'ϟ', tone: 'gold', color: '#84b6a5' },
    travel: { label: 'Travel', icon: '↗', tone: 'lilac', color: '#eab875' },
    life: { label: 'Shopping & life', icon: '⌂', tone: '', color: '#b7cad7' },
    other: { label: 'Other', icon: '•', tone: '', color: '#9daec0' }
  };
  const period = () => { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; };
  const localDate = (value) => {
    const date = new Date(`${value}T12:00:00`);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  const key = () => {
    let email = 'guest';
    try { email = JSON.parse(localStorage.getItem('pacshield-account') || '{}').email || 'guest'; } catch {}
    return `pacshield-ledger-v1:${email.trim().toLowerCase()}`;
  };
  const escape = (value) => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = cents => '₹' + (cents / 100).toLocaleString('en-IN', { minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 });
  const parseRupees = value => {
    const match = String(value).trim().replace(/,/g, '').match(/^(\d{1,9})(?:\.(\d{1,2}))?$/);
    if (!match) return null;
    const paise = Number(match[1]) * 100 + Number((match[2] || '').padEnd(2, '0'));
    return Number.isSafeInteger(paise) && paise > 0 ? paise : null;
  };
  const today = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  const daysLeft = () => new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate() + 1;
  let db;
  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(key()) || 'null');
      if (saved && Array.isArray(saved.transactions) && saved.budgets) return saved;
    } catch {}
    return { transactions: [], budgets: { month: period(), overall: 0, categories: {} }, alerts: [] };
  }
  function save() {
    db.budgets.month = period();
    try { localStorage.setItem(key(), JSON.stringify(db)); }
    catch { showToast('Could not save. Check browser storage space and try again.'); }
  }
  const current = () => db.transactions.filter(t => t.date.slice(0, 7) === period());
  const sums = () => {
    const totals = { income: 0, spent: 0, categories: {}, today: 0 };
    current().forEach(t => {
      if (t.type === 'income') totals.income += t.amount;
      else {
        totals.spent += t.amount;
        totals.categories[t.category] = (totals.categories[t.category] || 0) + t.amount;
        if (t.date === today()) totals.today += t.amount;
      }
    });
    return totals;
  };
  const usage = (totals, budgets) => {
    const items = [];
    if (budgets.overall > 0) items.push({ id: 'overall', label: 'Overall monthly budget', spent: totals.spent, limit: budgets.overall });
    Object.entries(budgets.categories || {}).forEach(([category, limit]) => {
      if (limit > 0) items.push({ id: category, label: categories[category].label, spent: totals.categories[category] || 0, limit });
    });
    return items;
  };
  function renderTransactions(filter = '') {
    const list = document.getElementById('transaction-list');
    if (!list) return;
    const rows = current().filter(t => `${t.name} ${categories[t.category]?.label || ''} ${t.type}`.toLowerCase().includes(filter.toLowerCase())).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
    list.innerHTML = rows.length ? rows.slice(0, 12).map(t => {
      const cat = categories[t.category] || categories.other;
      const sign = t.type === 'income' ? '+' : '';
      return `<div class="transaction-row"><div class="transaction-name"><span class="tx-icon ${cat.tone}">${cat.icon}</span>${escape(t.name)}</div><span class="category-tag">${escape(cat.label)}${t.type === 'income' ? ' · Income' : ''}</span><span class="tx-date">${localDate(t.date)}</span><span class="tx-amount ${t.type === 'income' ? 'income' : 'expense'}">${sign}${fmt(t.amount)}</span></div>`;
    }).join('') : `<div class="empty-state">${filter ? 'No matching activity this month.' : 'No entries this month yet. Add an income or expense to start tracking.'}</div>`;
  }
  function renderDashboard() {
    const s = sums();
    const available = s.income - s.spent;
    const budget = db.budgets.overall || 0;
    const remaining = budget ? Math.max(0, budget - s.spent) : 0;
    const pct = budget ? Math.min(100, Math.round(s.spent / budget * 100)) : 0;
    document.getElementById('spent-total').textContent = fmt(s.spent);
    document.getElementById('balance').textContent = `${available < 0 ? '−' : ''}${Math.abs(available / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    document.querySelector('.balance-decimal').textContent = '.' + String(Math.abs(available) % 100).padStart(2, '0');
    document.querySelector('.balance-label').childNodes[0].textContent = available < 0 ? 'Net spending this month ' : 'Available this month ';
    const incomeEl = document.getElementById('income-total');
    if (incomeEl) incomeEl.textContent = fmt(s.income);
    document.getElementById('safe-today').textContent = (Math.floor(Math.max(0, (budget ? remaining : Math.max(0, available)) / Math.max(1, daysLeft())) / 100)).toLocaleString('en-IN');
    document.getElementById('overall-budget-amount').textContent = budget ? fmt(budget) : 'Not set';
    document.getElementById('overall-budget-used').textContent = `${fmt(s.spent)} used`;
    document.getElementById('overall-budget-left').textContent = budget ? `${fmt(remaining)} left · ${pct}% used` : 'Set a monthly limit to track progress';
    document.getElementById('overall-budget-progress').style.width = `${pct}%`;
    document.getElementById('donut-total').textContent = fmt(s.spent);
    const totalCirc = 2 * Math.PI * 62;
    let offset = 0;
    document.querySelectorAll('.donut-segment').forEach((circle, i) => {
      const cat = ['food', 'bills', 'travel', 'life', 'other'][i];
      const amount = s.categories[cat] || 0;
      const fraction = s.spent ? amount / s.spent : 0;
      circle.style.strokeDasharray = `${totalCirc * fraction} ${totalCirc}`;
      circle.style.strokeDashoffset = `${-offset}`;
      offset += totalCirc * fraction;
    });
    const categoryIds = ['food', 'bills', 'travel', 'life', 'other'];
    document.getElementById('category-list').innerHTML = categoryIds.map(id => {
      const amount = s.categories[id] || 0;
      const percent = s.spent ? Math.round(amount / s.spent * 100) : 0;
      return `<div class="category-row"><span class="category-dot ${id}"></span><span>${categories[id].label}</span><strong>${fmt(amount)}</strong><small>${percent}%</small></div>`;
    }).join('');
    const leading = usage(s, db.budgets).filter(x => x.limit > 0).sort((a, b) => b.spent / b.limit - a.spent / a.limit)[0];
    document.getElementById('budget-nudge-title').textContent = leading ? leading.label : 'Your monthly budget';
    document.getElementById('budget-nudge-status').textContent = leading ? `${Math.round(leading.spent / leading.limit * 100)}% USED` : 'READY TO SET';
    document.getElementById('budget-nudge-copy').textContent = leading ? `${fmt(leading.spent)} spent of ${fmt(leading.limit)}. ${leading.spent >= leading.limit ? 'This budget is over its limit.' : `${fmt(leading.limit - leading.spent)} remains this month.`}` : 'Set a monthly or category limit to get clear progress and helpful alerts.';
    document.getElementById('budget-nudge-spent').textContent = `${fmt(leading?.spent || 0)} spent`;
    document.getElementById('budget-nudge-limit').textContent = leading ? fmt(leading.limit) : 'No limit set';
    document.getElementById('budget-nudge-progress').style.width = `${leading ? Math.min(100, leading.spent / leading.limit * 100) : 0}%`;
    renderTransactions(document.getElementById('search-input')?.value || '');
  }
  function openBudgetModal() {
    document.getElementById('budget-overall-input').value = db.budgets.overall ? (db.budgets.overall / 100).toFixed(2) : '';
    Object.keys(categories).forEach(id => document.getElementById(`budget-${id}-input`).value = db.budgets.categories[id] ? (db.budgets.categories[id] / 100).toFixed(2) : '');
    openModal('budget-modal');
  }
  function openTransactionModal() {
    document.getElementById('transaction-form').reset();
    document.getElementById('transaction-date').value = today();
    openModal('transaction-modal');
  }
  function notifyCrossings(before, after) {
    const crossed = [];
    after.forEach(item => {
      const prior = before.find(old => old.id === item.id);
      [80, 100].forEach(threshold => {
        const keyId = `${period()}:${item.id}:${threshold}`;
        if (item.spent > 0 && item.spent / item.limit * 100 >= threshold && (!prior || prior.spent / prior.limit * 100 < threshold) && !db.alerts.includes(keyId)) {
          crossed.push({ ...item, threshold });
          db.alerts.push(keyId);
        }
      });
    });
    if (!crossed.length) return;
    save();
    const highest = Math.max(...crossed.map(x => x.threshold));
    const matching = crossed.filter(x => x.threshold === highest);
    const first = matching[0];
    document.getElementById('budget-alert-heading').textContent = highest === 100 ? (first.spent > first.limit ? 'Budget limit passed' : 'Budget reached') : 'Budget getting close';
    document.getElementById('budget-alert-message').textContent = `${first.label}: ${fmt(first.spent)} spent of ${fmt(first.limit)} (${Math.round(first.spent / first.limit * 100)}%).${matching.length > 1 ? ` Also: ${matching.slice(1).map(x => x.label).join(', ')}.` : ''}`;
    openModal('budget-alert-modal');
  }
  document.getElementById('transaction-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const amount = parseRupees(form.elements.amount.value);
    const name = form.elements.name.value.trim();
    if (!name || !amount) return showToast('Enter a name and an amount greater than ₹0.');
    const beforeTotals = sums();
    const beforeBudgets = usage(beforeTotals, db.budgets);
    db.transactions.push({ id: crypto.randomUUID(), name, type: form.elements.type.value, category: form.elements.category.value, date: form.elements.date.value, amount, createdAt: Date.now() });
    save(); renderDashboard();
    const after = usage(sums(), db.budgets);
    closeModal('transaction-modal');
    showToast('Entry saved on this browser.');
    notifyCrossings(beforeBudgets, after);
  });
  document.getElementById('budget-form').addEventListener('submit', event => {
    event.preventDefault();
    const getAmount = id => {
      const value = document.getElementById(id).value.trim();
      return value ? parseRupees(value) : 0;
    };
    const overall = getAmount('budget-overall-input');
    const categoryBudgets = {};
    for (const id of Object.keys(categories)) categoryBudgets[id] = getAmount(`budget-${id}-input`);
    if (document.getElementById('budget-overall-input').value.trim() && !overall || Object.keys(categories).some(id => document.getElementById(`budget-${id}-input`).value.trim() && !categoryBudgets[id])) return showToast('Enter valid budget amounts greater than ₹0.');
    const before = usage(sums(), db.budgets);
    db.budgets = { month: period(), overall, categories: categoryBudgets };
    const after = usage(sums(), db.budgets);
    save(); renderDashboard();
    closeModal('budget-modal');
    showToast('Budgets saved on this browser.');
    notifyCrossings(before, after);
  });
  document.addEventListener('click', event => {
    const target = event.target.closest('[data-ledger]');
    if (!target) return;
    if (target.dataset.ledger === 'add') openTransactionModal();
    if (target.dataset.ledger === 'budgets') openBudgetModal();
    if (target.dataset.ledger === 'alert-budgets') { closeModal('budget-alert-modal'); openBudgetModal(); }
  });
  document.getElementById('search-input').addEventListener('input', () => renderTransactions(document.getElementById('search-input').value));
  document.querySelectorAll('[data-view="budgets"]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); openBudgetModal(); }));
  db = load();
  transactions = db.transactions;
  if (db.budgets.month !== period()) db.alerts = db.alerts.filter(alert => alert.startsWith(`${period()}:`));
  window.renderTransactions = renderTransactions;
  window.updateTotals = renderDashboard;
  document.getElementById('date-label').textContent = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  document.getElementById('today-label').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();
  renderDashboard();
})();
