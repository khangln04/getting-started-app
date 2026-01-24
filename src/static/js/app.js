function App() {
    const { Container, Row, Col } = ReactBootstrap;
    return (
        <Container style={{ maxWidth: '650px' }}>
            <Row>
                <Col>
                    <TodoListCard />
                </Col>
            </Row>
        </Container>
    );
}

function TodoListCard() {
    const [items, setItems] = React.useState(null);
    const [animatingIds, setAnimatingIds] = React.useState(new Set());

    React.useEffect(() => {
        fetch('/items')
            .then(r => r.json())
            .then(setItems);
    }, []);

    const onNewItem = React.useCallback(
        newItem => {
            setItems([...items, newItem]);
        },
        [items],
    );

    const onItemUpdate = React.useCallback(
        item => {
            const index = items.findIndex(i => i.id === item.id);
            setItems([
                ...items.slice(0, index),
                item,
                ...items.slice(index + 1),
            ]);
        },
        [items],
    );

    const onItemRemoval = React.useCallback(
        item => {
            setAnimatingIds(new Set([...animatingIds, item.id]));
            setTimeout(() => {
                const index = items.findIndex(i => i.id === item.id);
                setItems([...items.slice(0, index), ...items.slice(index + 1)]);
                setAnimatingIds(new Set([...animatingIds].filter(id => id !== item.id)));
            }, 300);
        },
        [items, animatingIds],
    );

    const completedCount = items?.filter(i => i.completed).length || 0;

    if (items === null) return (
        <div className="todo-container">
            <div className="loading">
                <i className="fas fa-spinner"></i> Loading your tasks...
            </div>
        </div>
    );

    const progress = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

    return (
        <div className="todo-container">
            <div className="todo-header">
                <h1>✨ Task Manager</h1>
                <p>Stay organized and get things done</p>
            </div>
            <div className="add-item-form">
                <AddItemForm onNewItem={onNewItem} />
                {items.length > 0 && (
                    <div style={{ marginTop: '18px', textAlign: 'center' }}>
                        <div style={{ 
                            fontSize: '0.95rem', 
                            color: '#667eea', 
                            fontWeight: '600',
                            marginBottom: '8px'
                        }}>
                            Progress: {completedCount} / {items.length} ({progress}%)
                        </div>
                        <div style={{ 
                            width: '100%', 
                            height: '8px',
                            backgroundColor: '#e8e8e8',
                            borderRadius: '10px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${progress}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                transition: 'width 0.5s ease',
                                borderRadius: '10px'
                            }}></div>
                        </div>
                    </div>
                )}
            </div>
            <div className="items-container">
                {items.length === 0 && (
                    <div className="empty-state">
                        <p>🎯 No tasks yet! Add one to get started!</p>
                    </div>
                )}
                {items.map(item => (
                    <ItemDisplay
                        item={item}
                        key={item.id}
                        onItemUpdate={onItemUpdate}
                        onItemRemoval={onItemRemoval}
                        isAnimating={animatingIds.has(item.id)}
                    />
                ))}
            </div>
        </div>
    );
}

function AddItemForm({ onNewItem }) {
    const [newItem, setNewItem] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);

    const submitNewItem = e => {
        e.preventDefault();
        if (!newItem.trim()) return;
        
        setSubmitting(true);
        fetch('/items', {
            method: 'POST',
            body: JSON.stringify({ name: newItem }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(item => {
                onNewItem(item);
                setSubmitting(false);
                setNewItem('');
            })
            .catch(() => setSubmitting(false));
    };

    return (
        <form onSubmit={submitNewItem} style={{ display: 'flex', gap: '10px' }}>
            <input
                type="text"
                className="form-control"
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
                placeholder="Add a new task..."
                disabled={submitting}
                style={{ flex: 1 }}
            />
            <button
                type="submit"
                className="btn-add"
                disabled={!newItem.trim() || submitting}
            >
                <i className="fas fa-plus"></i> {submitting ? 'Adding...' : 'Add'}
            </button>
        </form>
    );
}

function ItemDisplay({ item, onItemUpdate, onItemRemoval }) {
    const { Container, Row, Col, Button } = ReactBootstrap;

    const toggleCompletion = () => {
        fetch(`/items/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: item.name,
                completed: !item.completed,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(onItemUpdate);
    };

    const removeItem = () => {
        fetch(`/items/${item.id}`, { method: 'DELETE' }).then(() =>
            onItemRemoval(item),
        );
    };

    return (
        <div className={`item ${item.completed && 'completed'}`}>
            <input
                type="checkbox"
                className="item-checkbox"
                checked={item.completed}
                onChange={toggleCompletion}
                aria-label={
                    item.completed
                        ? 'Mark item as incomplete'
                        : 'Mark item as complete'
                }
            />
            <span className="name">{item.name}</span>
            <div className="item-actions">
                <button
                    className="btn-remove"
                    onClick={removeItem}
                    aria-label="Delete task"
                    title="Delete task"
                >
                    <i className="fas fa-trash-alt"></i>
                </button>
            </div>
        </div

ReactDOM.render(<App />, document.getElementById('root'));
