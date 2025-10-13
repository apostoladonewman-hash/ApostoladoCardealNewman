import { useState, ReactNode } from 'react';

interface Tab {
  slug: string;
  title: string;
  description?: string;
  content: ReactNode;
  order?: number;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export function Tabs({ tabs, defaultTab, className = '' }: TabsProps) {
  const sortedTabs = [...tabs].sort((a, b) => (a.order || 0) - (b.order || 0));
  const [activeTab, setActiveTab] = useState(defaultTab || sortedTabs[0]?.slug);

  const currentTab = sortedTabs.find((tab) => tab.slug === activeTab);

  return (
    <div className={className}>
      {/* Tab Navigation */}
      <div className="border-b border-border/40">
        <nav className="flex flex-wrap gap-2 -mb-px" aria-label="Tabs">
          {sortedTabs.map((tab) => (
            <button
              key={tab.slug}
              onClick={() => setActiveTab(tab.slug)}
              className={`
                px-4 py-3 text-sm font-medium border-b-2 transition-all duration-300
                ${
                  activeTab === tab.slug
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/30'
                }
              `}
              aria-current={activeTab === tab.slug ? 'page' : undefined}
            >
              {tab.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {currentTab && (
          <div className="animate-in fade-in duration-500">
            {currentTab.description && (
              <p className="text-muted-foreground mb-6 text-lg">
                {currentTab.description}
              </p>
            )}
            <div>{currentTab.content}</div>
          </div>
        )}
      </div>
    </div>
  );
}
