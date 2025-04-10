using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace caps;

public class CodeChunk
{
    public string FilePath { get; set; }
    public string Type { get; set; } // class, method, struct
    public string Name { get; set; }
    public string Code { get; set; }
    public string DocComment { get; set; }
}

public class Chunker
{
    public static List<CodeChunk> ExtractChunks(string rootPath)
    {
        var chunks = new List<CodeChunk>();
        var files = Directory.GetFiles(rootPath, "*.cs", SearchOption.AllDirectories);

        foreach (var file in files)
        {
            var code = File.ReadAllText(file);
            var tree = CSharpSyntaxTree.ParseText(code);
            var root = tree.GetCompilationUnitRoot();

            foreach (var cls in root.DescendantNodes().OfType<ClassDeclarationSyntax>())
            {
                chunks.Add(new CodeChunk
                {
                    FilePath = file,
                    Type = "class",
                    Name = cls.Identifier.Text,
                    Code = cls.ToFullString(),
                    DocComment = cls.GetLeadingTrivia().ToFullString()
                });

                foreach (var method in cls.DescendantNodes().OfType<MethodDeclarationSyntax>())
                {
                    chunks.Add(new CodeChunk
                    {
                        FilePath = file,
                        Type = "method",
                        Name = method.Identifier.Text,
                        Code = method.ToFullString(),
                        DocComment = method.GetLeadingTrivia().ToFullString()
                    });
                }
            }

            foreach (var strct in root.DescendantNodes().OfType<StructDeclarationSyntax>())
            {
                chunks.Add(new CodeChunk
                {
                    FilePath = file,
                    Type = "struct",
                    Name = strct.Identifier.Text,
                    Code = strct.ToFullString(),
                    DocComment = strct.GetLeadingTrivia().ToFullString()
                });
            }
        }

        return chunks;
    }
}